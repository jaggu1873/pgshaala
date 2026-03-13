-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule job to clear expired soft locks every 15 minutes
SELECT cron.schedule(
    'clear-expired-soft-locks',
    '*/15 * * * *',
    'SELECT clear_expired_soft_locks();'
);

-- Schedule job to decay lead scores every night at 2 AM
SELECT cron.schedule(
    'decay-lead-scores-nightly',
    '0 2 * * *',
    'SELECT decay_lead_scores();'
);

-- Schedule job to auto escalate leads every 30 minutes
SELECT cron.schedule(
    'auto-escalate-leads',
    '*/30 * * * *',
    'SELECT auto_escalate_leads();'
);
