CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;
-- 1. Room status enum
CREATE TYPE public.room_status AS ENUM ('occupied', 'vacating', 'vacant', 'blocked');

-- 2. Owners table
CREATE TABLE public.owners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  company_name text,
  notes text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.owners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anon read owners" ON public.owners FOR SELECT USING (true);
CREATE POLICY "Auth users manage owners" ON public.owners FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth users update owners" ON public.owners FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Auth users delete owners" ON public.owners FOR DELETE USING (true);

CREATE TRIGGER update_owners_updated_at BEFORE UPDATE ON public.owners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 3. Add owner_id to properties
ALTER TABLE public.properties ADD COLUMN owner_id uuid REFERENCES public.owners(id) ON DELETE SET NULL;

-- 4. Rooms table (the atomic unit: Room × Status)
CREATE TABLE public.rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  room_number text NOT NULL,
  floor text,
  bed_count integer NOT NULL DEFAULT 1,
  status public.room_status NOT NULL DEFAULT 'vacant',
  vacating_date date,
  actual_rent numeric,
  expected_rent numeric,
  min_acceptable_rent numeric,
  amenities text[],
  room_type text,
  last_confirmed_at timestamptz DEFAULT now(),
  auto_locked boolean NOT NULL DEFAULT false,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anon read rooms" ON public.rooms FOR SELECT USING (true);
CREATE POLICY "Auth users manage rooms" ON public.rooms FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth users update rooms" ON public.rooms FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Auth users delete rooms" ON public.rooms FOR DELETE USING (true);

CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON public.rooms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. Room status log (daily confirmation ritual)
CREATE TABLE public.room_status_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  status public.room_status NOT NULL,
  confirmed_by uuid REFERENCES public.owners(id),
  rent_updated boolean NOT NULL DEFAULT false,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.room_status_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anon read room_status_log" ON public.room_status_log FOR SELECT USING (true);
CREATE POLICY "Auth users manage room_status_log" ON public.room_status_log FOR INSERT WITH CHECK (true);

-- 6. Soft locks (visit-room binding)
CREATE TYPE public.lock_type AS ENUM ('visit_scheduled', 'pre_booking', 'virtual_tour');

CREATE TABLE public.soft_locks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  lead_id uuid REFERENCES public.leads(id) ON DELETE SET NULL,
  lock_type public.lock_type NOT NULL,
  locked_by uuid REFERENCES public.agents(id),
  locked_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.soft_locks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anon read soft_locks" ON public.soft_locks FOR SELECT USING (true);
CREATE POLICY "Auth users manage soft_locks" ON public.soft_locks FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth users update soft_locks" ON public.soft_locks FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Auth users delete soft_locks" ON public.soft_locks FOR DELETE USING (true);

-- 7. Auto-lock function: rooms not confirmed in 24h get auto_locked = true
CREATE OR REPLACE FUNCTION public.auto_lock_stale_rooms()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE rooms
  SET auto_locked = true
  WHERE last_confirmed_at < now() - interval '24 hours'
    AND auto_locked = false
    AND status != 'occupied';
END;
$$;

-- 8. Trigger: when room status is confirmed, update last_confirmed_at and unlock
CREATE OR REPLACE FUNCTION public.on_room_status_confirm()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE rooms
  SET last_confirmed_at = now(),
      auto_locked = false,
      status = NEW.status
  WHERE id = NEW.room_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER room_status_confirm_trigger
  AFTER INSERT ON public.room_status_log
  FOR EACH ROW EXECUTE FUNCTION on_room_status_confirm();

-- 9. Effort tracking view: leads/visits/tours per property (as a function for flexibility)
CREATE OR REPLACE FUNCTION public.get_property_effort(p_property_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'total_leads', (SELECT COUNT(*) FROM leads WHERE property_id = p_property_id),
    'total_visits', (SELECT COUNT(*) FROM visits WHERE property_id = p_property_id),
    'completed_visits', (SELECT COUNT(*) FROM visits WHERE property_id = p_property_id AND outcome IS NOT NULL),
    'booked', (SELECT COUNT(*) FROM visits WHERE property_id = p_property_id AND outcome = 'booked'),
    'considering', (SELECT COUNT(*) FROM visits WHERE property_id = p_property_id AND outcome = 'considering'),
    'not_interested', (SELECT COUNT(*) FROM visits WHERE property_id = p_property_id AND outcome = 'not_interested')
  ) INTO result;
  RETURN result;
END;
$$;

-- 10. Enable realtime for rooms
ALTER PUBLICATION supabase_realtime ADD TABLE public.rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.soft_locks;

-- 1. Bed status enum
CREATE TYPE public.bed_status AS ENUM ('vacant', 'occupied', 'vacating_soon', 'blocked', 'reserved', 'booked');

-- 2. Enhance properties table
ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS property_manager text,
  ADD COLUMN IF NOT EXISTS total_rooms integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_beds integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS amenities text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS gender_allowed text DEFAULT 'any',
  ADD COLUMN IF NOT EXISTS google_maps_link text,
  ADD COLUMN IF NOT EXISTS photos text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS virtual_tour_link text;

-- 3. Enhance rooms table
ALTER TABLE public.rooms
  ADD COLUMN IF NOT EXISTS room_code text,
  ADD COLUMN IF NOT EXISTS bathroom_type text,
  ADD COLUMN IF NOT EXISTS furnishing text,
  ADD COLUMN IF NOT EXISTS rent_per_bed numeric;

-- 4. Beds table
CREATE TABLE public.beds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  bed_number text NOT NULL,
  status public.bed_status NOT NULL DEFAULT 'vacant',
  current_tenant_name text,
  current_rent numeric,
  move_in_date date,
  move_out_date date,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.beds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anon read beds" ON public.beds FOR SELECT USING (true);
CREATE POLICY "Auth users manage beds" ON public.beds FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth users update beds" ON public.beds FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Auth users delete beds" ON public.beds FOR DELETE USING (true);

CREATE TRIGGER update_beds_updated_at BEFORE UPDATE ON public.beds
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. Add bed_id to visits
ALTER TABLE public.visits
  ADD COLUMN IF NOT EXISTS room_id uuid REFERENCES public.rooms(id),
  ADD COLUMN IF NOT EXISTS bed_id uuid REFERENCES public.beds(id);

-- 6. Add bed_id to soft_locks
ALTER TABLE public.soft_locks
  ADD COLUMN IF NOT EXISTS bed_id uuid REFERENCES public.beds(id);

-- 7. Enable realtime for beds
ALTER PUBLICATION supabase_realtime ADD TABLE public.beds;

-- 8. Bed status log for tracking changes
CREATE TABLE public.bed_status_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bed_id uuid NOT NULL REFERENCES public.beds(id) ON DELETE CASCADE,
  old_status public.bed_status,
  new_status public.bed_status NOT NULL,
  changed_by text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.bed_status_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anon read bed_status_log" ON public.bed_status_log FOR SELECT USING (true);
CREATE POLICY "Auth users manage bed_status_log" ON public.bed_status_log FOR INSERT WITH CHECK (true);

-- 9. Trigger: log bed status changes
CREATE OR REPLACE FUNCTION public.log_bed_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO bed_status_log (bed_id, old_status, new_status)
    VALUES (NEW.id, OLD.status, NEW.status);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER bed_status_change_trigger
  AFTER UPDATE ON public.beds
  FOR EACH ROW EXECUTE FUNCTION log_bed_status_change();

-- 10. Function: auto-generate beds when room is created
CREATE OR REPLACE FUNCTION public.auto_create_beds()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  i integer;
BEGIN
  FOR i IN 1..NEW.bed_count LOOP
    INSERT INTO beds (room_id, bed_number) VALUES (NEW.id, 'B' || i);
  END LOOP;
  RETURN NEW;
END;
$$;

CREATE TRIGGER auto_create_beds_trigger
  AFTER INSERT ON public.rooms
  FOR EACH ROW EXECUTE FUNCTION auto_create_beds();

-- Booking status enum
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'checked_in', 'checked_out');

-- Payment status enum
CREATE TYPE public.payment_status AS ENUM ('unpaid', 'partial', 'paid');

-- Bookings table
CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  property_id uuid REFERENCES public.properties(id),
  room_id uuid REFERENCES public.rooms(id),
  bed_id uuid REFERENCES public.beds(id),
  visit_id uuid REFERENCES public.visits(id),
  booking_status public.booking_status NOT NULL DEFAULT 'pending',
  monthly_rent numeric,
  security_deposit numeric,
  move_in_date date,
  move_out_date date,
  payment_status public.payment_status NOT NULL DEFAULT 'unpaid',
  notes text,
  booked_by uuid REFERENCES public.agents(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Updated_at trigger
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anon read bookings" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Auth users insert bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth users update bookings" ON public.bookings FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Auth users delete bookings" ON public.bookings FOR DELETE USING (true);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;

-- Trigger: visit outcome 'booked' → auto-create booking + soft lock
CREATE OR REPLACE FUNCTION public.on_visit_booked()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.outcome IS DISTINCT FROM NEW.outcome AND NEW.outcome = 'booked' THEN
    -- Create pending booking
    INSERT INTO public.bookings (lead_id, property_id, room_id, bed_id, visit_id, booking_status, booked_by)
    VALUES (NEW.lead_id, NEW.property_id, NEW.room_id, NEW.bed_id, NEW.id, 'pending', NEW.assigned_staff_id);

    -- Create pre_booking soft lock (24h) if bed is specified
    IF NEW.bed_id IS NOT NULL THEN
      INSERT INTO public.soft_locks (room_id, bed_id, lead_id, lock_type, locked_by, expires_at, notes)
      VALUES (NEW.room_id, NEW.bed_id, NEW.lead_id, 'pre_booking', NEW.assigned_staff_id, now() + interval '24 hours', 'Auto-locked from visit booking');
    END IF;

    -- Update lead status to booked
    UPDATE public.leads SET status = 'booked' WHERE id = NEW.lead_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_visit_booked AFTER UPDATE ON public.visits
  FOR EACH ROW EXECUTE FUNCTION public.on_visit_booked();

-- Trigger: booking confirmed → bed status 'booked'
CREATE OR REPLACE FUNCTION public.on_booking_confirmed()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF OLD.booking_status IS DISTINCT FROM NEW.booking_status AND NEW.booking_status = 'confirmed' THEN
    IF NEW.bed_id IS NOT NULL THEN
      UPDATE public.beds SET status = 'booked' WHERE id = NEW.bed_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_booking_confirmed AFTER UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.on_booking_confirmed();

-- Trigger: booking cancelled → release locks + revert bed
CREATE OR REPLACE FUNCTION public.on_booking_cancelled()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF OLD.booking_status IS DISTINCT FROM NEW.booking_status AND NEW.booking_status = 'cancelled' THEN
    -- Release soft locks for this lead+room
    UPDATE public.soft_locks SET is_active = false
    WHERE lead_id = NEW.lead_id AND room_id = NEW.room_id AND is_active = true;

    -- Revert bed to vacant if it was booked
    IF NEW.bed_id IS NOT NULL THEN
      UPDATE public.beds SET status = 'vacant' WHERE id = NEW.bed_id AND status = 'booked';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_booking_cancelled AFTER UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.on_booking_cancelled();

-- Also attach the missing triggers from earlier
CREATE TRIGGER trg_auto_score_lead AFTER INSERT OR UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.auto_score_lead();

CREATE TRIGGER trg_log_lead_status AFTER UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.log_lead_status_change();

CREATE TRIGGER trg_log_lead_agent AFTER UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.log_lead_agent_change();
-- Run this in Supabase SQL Editor to finish setup!

-- 1. Confirm emails if required
UPDATE auth.users SET email_confirmed_at = NOW() WHERE email IN ('owner1@gharpayy.com', 'owner2@gharpayy.com', 'owner3@gharpayy.com');

-- 2. Insert into owners table
INSERT INTO public.owners (id, user_id, name, email, phone, company_name)
VALUES
  (gen_random_uuid(), '48e9bdf0-c6c7-45a2-8ccd-2d71ce8f82f2', 'Ramesh Reddy', 'owner1@gharpayy.com', '9999999990', 'Reddy Properties'),
  (gen_random_uuid(), 'a518a0ec-9714-48f7-895e-b5542a9166d2', 'Suresh Kumar', 'owner2@gharpayy.com', '9999999991', 'Kumar Co-living'),
  (gen_random_uuid(), '440165b0-0e01-4db4-823f-0f2dad90a9fc', 'Priya Sharma', 'owner3@gharpayy.com', '9999999992', 'Sharma PG')
ON CONFLICT (user_id) DO NOTHING;

-- 3. Assign properties to owners
WITH 
  o1 AS (SELECT id FROM public.owners WHERE email = 'owner1@gharpayy.com' LIMIT 1),
  o2 AS (SELECT id FROM public.owners WHERE email = 'owner2@gharpayy.com' LIMIT 1),
  o3 AS (SELECT id FROM public.owners WHERE email = 'owner3@gharpayy.com' LIMIT 1)
UPDATE public.properties SET owner_id = 
  CASE 
    WHEN name IN ('FORUM PRO BOYS', 'FORUM 1 BOYS', 'GQ girl') THEN (SELECT id FROM o1)
    WHEN name IN ('GT GIRLS', 'ESPLANADE GIRLS', 'homely GIRLS', 'homely BOYS') THEN (SELECT id FROM o2)
    ELSE (SELECT id FROM o3)
  END;

