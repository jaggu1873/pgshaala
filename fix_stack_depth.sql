-- Drop duplicate triggers that cause infinite recursion ("stack depth limit exceeded")
DROP TRIGGER IF EXISTS trg_auto_score_lead ON public.leads;
DROP TRIGGER IF EXISTS trg_log_lead_status ON public.leads;
DROP TRIGGER IF EXISTS trg_log_lead_agent ON public.leads;
DROP TRIGGER IF EXISTS trg_log_visit ON public.visits;
DROP TRIGGER IF EXISTS trg_auto_create_beds ON public.rooms;
DROP TRIGGER IF EXISTS trg_log_bed_status ON public.beds;
DROP TRIGGER IF EXISTS trg_room_status_confirm ON public.room_status_log;
