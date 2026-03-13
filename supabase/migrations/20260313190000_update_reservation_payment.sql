-- Update confirm_reservation to support gateway names like razorpay or upi
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
    v_gateway text := 'razorpay';
BEGIN
    SELECT * INTO v_res FROM reservations WHERE id = p_reservation_id;
    IF NOT FOUND THEN 
        RETURN jsonb_build_object('error', 'Reservation not found'); 
    END IF;
    IF v_res.reservation_status != 'pending' THEN 
        RETURN jsonb_build_object('error', 'Reservation already processed'); 
    END IF;

    IF p_payment_reference LIKE 'SIM_%' THEN
        v_gateway := 'manual';
    END IF;

    -- Record the payment transaction
    INSERT INTO payment_transactions (
        reservation_id, gateway_transaction_id, gateway_name,
        amount, status, payment_method, completed_at,
        payer_name, payer_phone, payer_email
    ) VALUES (
        p_reservation_id, p_payment_reference, v_gateway,
        COALESCE(v_res.reservation_fee, 1000), 'success', CASE WHEN v_gateway = 'razorpay' THEN 'upi_or_card' ELSE 'manual' END, now(),
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
