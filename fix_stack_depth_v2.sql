-- Fix stack depth limit exceeded by stopping recursion in triggers

-- 1. Fix auto_score_lead so it doesn't cause an infinite UPDATE loop
CREATE OR REPLACE FUNCTION public.auto_score_lead()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_new_score integer;
BEGIN
  -- Avoid running this if lead_score is exactly what is being updated manually to prevent recursion
  IF TG_OP = 'UPDATE' AND OLD.lead_score IS DISTINCT FROM NEW.lead_score THEN
    RETURN NEW;
  END IF;

  v_new_score := calculate_lead_score(NEW.id);
  NEW.lead_score := v_new_score;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS lead_auto_score ON public.leads;
CREATE TRIGGER lead_auto_score
  BEFORE INSERT OR UPDATE OF status, first_response_time_min, budget, email, last_activity_at ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.auto_score_lead();

-- Ensure calculate_lead_score doesn't UPDATE the record if called from the trigger
CREATE OR REPLACE FUNCTION public.calculate_lead_score(p_lead_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_score integer := 0;
  v_lead leads%ROWTYPE;
  v_visit_count integer;
  v_conv_count integer;
BEGIN
  SELECT * INTO v_lead FROM leads WHERE id = p_lead_id;
  IF NOT FOUND THEN RETURN 0; END IF;

  CASE v_lead.status
    WHEN 'new' THEN v_score := 10;
    WHEN 'contacted' THEN v_score := 20;
    WHEN 'requirement_collected' THEN v_score := 35;
    WHEN 'property_suggested' THEN v_score := 50;
    WHEN 'visit_scheduled' THEN v_score := 65;
    WHEN 'visit_completed' THEN v_score := 80;
    WHEN 'booked' THEN v_score := 100;
    WHEN 'lost' THEN v_score := 5;
    ELSE v_score := 10;
  END CASE;

  IF v_lead.first_response_time_min IS NOT NULL AND v_lead.first_response_time_min <= 5 THEN
    v_score := v_score + 10;
  END IF;

  IF v_lead.budget IS NOT NULL AND v_lead.budget != '' THEN
    v_score := v_score + 5;
  END IF;

  IF v_lead.email IS NOT NULL AND v_lead.email != '' THEN
    v_score := v_score + 5;
  END IF;

  SELECT COUNT(*) INTO v_visit_count FROM visits WHERE lead_id = p_lead_id;
  v_score := v_score + LEAST(v_visit_count * 5, 15);

  SELECT COUNT(*) INTO v_conv_count FROM conversations WHERE lead_id = p_lead_id;
  v_score := v_score + LEAST(v_conv_count * 2, 10);

  IF v_lead.last_activity_at < now() - interval '7 days' THEN
    v_score := GREATEST(v_score - 15, 0);
  END IF;

  v_score := LEAST(v_score, 100);
  
  -- Prevent infinite UPDATE recursion
  -- Only update if the score is actually different
  IF v_lead.lead_score IS DISTINCT FROM v_score THEN
    UPDATE leads SET lead_score = v_score WHERE id = p_lead_id;
  END IF;
  
  RETURN v_score;
END;
$$;
