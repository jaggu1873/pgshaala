
-- ═══════════════════════════════════════════════════════
-- Production Database Improvements
-- 1. Register user_roles in types (table already exists from rbac_system migration)
-- 2. Add payment_transactions table for gateway tracking
-- ═══════════════════════════════════════════════════════

-- ─── Transaction Status Enum ─────────────────────────
DO $$ BEGIN
    CREATE TYPE public.transaction_status AS ENUM (
        'initiated',    -- payment started but not completed
        'pending',      -- waiting for gateway confirmation
        'success',      -- payment confirmed by gateway
        'failed',       -- payment rejected/declined
        'refunded',     -- full refund processed
        'partially_refunded' -- partial refund processed
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ─── Payment Transactions Table ──────────────────────
CREATE TABLE IF NOT EXISTS public.payment_transactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Link to reservation (required)
    reservation_id uuid NOT NULL REFERENCES public.reservations(id) ON DELETE CASCADE,

    -- Link to booking (optional, populated once booking is created)
    booking_id uuid REFERENCES public.bookings(id) ON DELETE SET NULL,

    -- Gateway fields
    gateway_name text NOT NULL DEFAULT 'manual',      -- razorpay, stripe, paytm, manual, etc.
    gateway_order_id text,                             -- order ID from the payment gateway
    gateway_transaction_id text,                       -- unique transaction ID from gateway
    gateway_signature text,                            -- verification signature from gateway
    gateway_response jsonb DEFAULT '{}'::jsonb,        -- full raw response from gateway for audit

    -- Amount fields
    amount numeric(12, 2) NOT NULL,                    -- amount in INR (or base currency)
    currency text NOT NULL DEFAULT 'INR',

    -- Status tracking
    status public.transaction_status NOT NULL DEFAULT 'initiated',
    failure_reason text,                               -- reason if status=failed
    
    -- Refund tracking
    refund_amount numeric(12, 2),
    refund_id text,                                    -- gateway refund ID
    refunded_at timestamptz,

    -- Metadata
    payment_method text,                               -- upi, card, netbanking, wallet
    payer_email text,
    payer_phone text,
    payer_name text,
    ip_address text,                                   -- for fraud detection
    notes text,

    -- Timestamps
    initiated_at timestamptz NOT NULL DEFAULT now(),
    completed_at timestamptz,                          -- when payment succeeded/failed
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- ─── Indexes ─────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_payment_txn_reservation 
    ON public.payment_transactions(reservation_id);
CREATE INDEX IF NOT EXISTS idx_payment_txn_booking 
    ON public.payment_transactions(booking_id);
CREATE INDEX IF NOT EXISTS idx_payment_txn_status 
    ON public.payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_payment_txn_gateway_txn_id 
    ON public.payment_transactions(gateway_transaction_id);
CREATE INDEX IF NOT EXISTS idx_payment_txn_gateway_order 
    ON public.payment_transactions(gateway_order_id);
CREATE INDEX IF NOT EXISTS idx_payment_txn_created 
    ON public.payment_transactions(created_at DESC);

-- Unique constraint: one gateway_transaction_id per gateway
CREATE UNIQUE INDEX IF NOT EXISTS idx_payment_txn_unique_gateway 
    ON public.payment_transactions(gateway_name, gateway_transaction_id) 
    WHERE gateway_transaction_id IS NOT NULL;

-- ─── RLS Policies ────────────────────────────────────
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

-- Admins/managers can see all transactions
DROP POLICY IF EXISTS "Staff can view all transactions" ON public.payment_transactions;
CREATE POLICY "Staff can view all transactions" ON public.payment_transactions
FOR SELECT TO authenticated
USING (
    public.get_my_role() IN ('admin', 'manager')
);

-- Owners can view transactions for their properties
DROP POLICY IF EXISTS "Owners can view their transactions" ON public.payment_transactions;
CREATE POLICY "Owners can view their transactions" ON public.payment_transactions
FOR SELECT TO authenticated
USING (
    public.get_my_role() = 'owner'
    AND reservation_id IN (
        SELECT r.id FROM public.reservations r
        JOIN public.properties p ON r.property_id = p.id
        JOIN public.owners o ON p.owner_id = o.id
        WHERE o.user_id = auth.uid()
    )
);

-- Allow system (authenticated) to insert transactions (from server-side functions)
DROP POLICY IF EXISTS "System can insert transactions" ON public.payment_transactions;
CREATE POLICY "System can insert transactions" ON public.payment_transactions
FOR INSERT TO authenticated
WITH CHECK (true);

-- Allow system to update transactions (for status callbacks)
DROP POLICY IF EXISTS "System can update transactions" ON public.payment_transactions;
CREATE POLICY "System can update transactions" ON public.payment_transactions
FOR UPDATE TO authenticated
USING (true)
WITH CHECK (true);

-- ─── Enable Realtime ─────────────────────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE public.payment_transactions;

-- ─── Auto-update updated_at trigger ──────────────────
CREATE OR REPLACE FUNCTION public.update_payment_txn_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_payment_txn_updated_at ON public.payment_transactions;
CREATE TRIGGER trg_payment_txn_updated_at
    BEFORE UPDATE ON public.payment_transactions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_payment_txn_updated_at();

-- ─── Add user_roles indexes (table exists from rbac_system) ──
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);

-- ─── Improved confirm_reservation with payment tracking ──────
CREATE OR REPLACE FUNCTION public.confirm_reservation(
    p_reservation_id uuid,
    p_payment_reference text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_res reservations%ROWTYPE;
    v_lead_id uuid;
    v_booking_id uuid;
    v_txn_id uuid;
BEGIN
    SELECT * INTO v_res FROM reservations WHERE id = p_reservation_id;
    IF NOT FOUND THEN 
        RETURN jsonb_build_object('error', 'Reservation not found'); 
    END IF;
    IF v_res.reservation_status != 'pending' THEN 
        RETURN jsonb_build_object('error', 'Reservation already processed'); 
    END IF;

    -- Record the payment transaction
    INSERT INTO payment_transactions (
        reservation_id, gateway_transaction_id, gateway_name,
        amount, status, payment_method, completed_at,
        payer_name, payer_phone, payer_email
    ) VALUES (
        p_reservation_id, p_payment_reference, 'manual',
        COALESCE(v_res.reservation_fee, 1000), 'success', 'manual', now(),
        v_res.customer_name, v_res.customer_phone, v_res.customer_email
    ) RETURNING id INTO v_txn_id;

    -- Update reservation
    UPDATE reservations 
    SET reservation_status = 'paid', 
        payment_reference = p_payment_reference, 
        updated_at = now() 
    WHERE id = p_reservation_id;

    -- Create CRM lead
    INSERT INTO leads (name, phone, email, source, status, property_id, preferred_location, notes)
    VALUES (
        v_res.customer_name, v_res.customer_phone, v_res.customer_email, 
        'website', 'booked', v_res.property_id,
        (SELECT area FROM properties WHERE id = v_res.property_id),
        'Online reservation #' || p_reservation_id::text || ' | Payment: ' || p_payment_reference || ' | Txn: ' || v_txn_id::text
    )
    RETURNING id INTO v_lead_id;

    -- Update reservation with lead
    UPDATE reservations SET lead_id = v_lead_id WHERE id = p_reservation_id;

    -- Create booking
    INSERT INTO bookings (lead_id, property_id, room_id, bed_id, booking_status, monthly_rent, move_in_date, payment_status, notes)
    VALUES (
        v_lead_id, v_res.property_id, v_res.room_id, v_res.bed_id, 
        'confirmed', v_res.monthly_rent, v_res.move_in_date, 'partial',
        'Online reservation fee paid | Txn: ' || v_txn_id::text
    )
    RETURNING id INTO v_booking_id;

    -- Link transaction to booking
    UPDATE payment_transactions SET booking_id = v_booking_id WHERE id = v_txn_id;

    -- Update bed to booked
    IF v_res.bed_id IS NOT NULL THEN
        UPDATE beds SET status = 'booked' WHERE id = v_res.bed_id;
    END IF;

    -- Deactivate soft lock
    IF v_res.soft_lock_id IS NOT NULL THEN
        UPDATE soft_locks SET is_active = false WHERE id = v_res.soft_lock_id;
    END IF;

    RETURN jsonb_build_object(
        'success', true, 
        'lead_id', v_lead_id, 
        'reservation_id', p_reservation_id,
        'booking_id', v_booking_id,
        'transaction_id', v_txn_id
    );
END;
$$;
