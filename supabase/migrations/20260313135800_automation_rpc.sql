
-- 1. Function to auto-cancel stale reservations (not confirmed in 24h)
CREATE OR REPLACE FUNCTION public.auto_lock_stale_rooms()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.reservations
  SET reservation_status = 'cancelled',
      updated_at = now()
  WHERE reservation_status = 'pending'
    AND created_at < now() - interval '24 hours';
END;
$$;

-- 2. Function to recalculate lead scores
CREATE OR REPLACE FUNCTION public.recalculate_all_lead_scores()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.leads
  SET lead_score = (
    CASE 
      WHEN status = 'new' THEN 20
      WHEN status = 'contacted' THEN 40
      WHEN status = 'requirement_collected' THEN 60
      WHEN status = 'property_suggested' THEN 75
      WHEN status = 'visit_scheduled' THEN 85
      WHEN status = 'visit_completed' THEN 95
      WHEN status = 'booked' THEN 100
      WHEN status = 'lost' THEN 0
      ELSE 10
    END
    + 
    CASE 
      WHEN first_response_time_min <= 5 THEN 10
      WHEN first_response_time_min <= 15 THEN 5
      ELSE 0
    END
    +
    CASE 
      WHEN last_activity_at >= (now() - interval '24 hours') THEN 10
      WHEN last_activity_at >= (now() - interval '72 hours') THEN 5
      ELSE 0
    END
  );
  
  -- Clamp score between 0 and 100
  UPDATE public.leads
  SET lead_score = GREATEST(0, LEAST(100, lead_score));
END;
$$;

-- 3. Function to create notifications for overdue follow-up reminders
CREATE OR REPLACE FUNCTION public.create_overdue_notifications()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.notifications (user_id, title, body, type, link)
  SELECT 
    a.user_id,
    'Overdue Follow-up',
    'Follow-up for ' || l.name || ' is overdue.',
    'reminder',
    '/leads?id=' || l.id
  FROM public.follow_up_reminders r
  JOIN public.leads l ON r.lead_id = l.id
  JOIN public.agents a ON r.agent_id = a.id
  WHERE r.is_completed = false
    AND r.reminder_date < now()
    AND a.user_id IS NOT NULL;
    
  -- We might want to mark them as "notified" if we had such a column, 
  -- or just let the job run periodically and create one notification per overdue item.
  -- To prevent duplicate notifications, we could add a check or a flag.
END;
$$;
