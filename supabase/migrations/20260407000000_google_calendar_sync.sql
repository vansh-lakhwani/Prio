-- Migration: Google Calendar Sync Support
-- Description: Adds tables and columns to support bi-directional synchronization with Google Calendar.

-- 1. Create Calendar Sync Settings Table
CREATE TABLE IF NOT EXISTS public.calendar_sync (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
    google_calendar_id TEXT DEFAULT 'primary',
    sync_enabled BOOLEAN DEFAULT FALSE,
    last_sync_at TIMESTAMPTZ,
    google_refresh_token TEXT, -- Stored to allow server-side sync without active session
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add Google Event ID to Tasks
-- This allows us to map Prio tasks to specific Google Calendar events.
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS google_event_id TEXT;

-- 3. Enable RLS
ALTER TABLE public.calendar_sync ENABLE ROW LEVEL SECURITY;

-- 4. RLS Polcies for calendar_sync
CREATE POLICY "Users can view own calendar sync settings" ON public.calendar_sync
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own calendar sync settings" ON public.calendar_sync
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own calendar sync settings" ON public.calendar_sync
    FOR UPDATE USING (auth.uid() = user_id);

-- 5. Trigger for updated_at
CREATE TRIGGER update_calendar_sync_modtime 
    BEFORE UPDATE ON public.calendar_sync 
    FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- 6. Grant Permissions
GRANT ALL ON public.calendar_sync TO authenticated;
GRANT ALL ON public.calendar_sync TO service_role;
