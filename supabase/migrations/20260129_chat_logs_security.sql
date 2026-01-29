-- Security hardening for chat_logs
-- Enables RLS and removes public access so chat logs are not readable/writable via anon/authenticated API keys.
-- Run via Supabase SQL editor or CLI migration.

alter table public.chat_logs enable row level security;

-- Remove public access via PostgREST.
revoke all on table public.chat_logs from anon, authenticated;
revoke all on table public.chat_logs from public;

-- Allow server-side inserts when using the service role key.
grant insert on table public.chat_logs to service_role;

-- If your table uses a serial/bigserial id, the service_role needs sequence usage.
-- Uncomment if inserts fail with sequence permissions.
-- grant usage, select on all sequences in schema public to service_role;

-- Optional: index for fast session-based lookups.
create index if not exists chat_logs_session_id_idx on public.chat_logs (session_id);
