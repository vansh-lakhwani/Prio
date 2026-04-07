-- Enable Realtime for all relevant tables
-- This adds the specified tables to the 'supabase_realtime' publication

-- 1. Add tables to the publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_stats;
ALTER PUBLICATION supabase_realtime ADD TABLE public.task_activity;
ALTER PUBLICATION supabase_realtime ADD TABLE public.subtasks;

-- Note: 'public.tasks' is already in the publication based on my investigation

-- 2. Set REPLICA IDENTITY FULL for tables we want to track updates for accurately
-- This ensures that the 'old' record in update/delete events contains all column values, 
-- which is useful for debugging and tracking complex state changes.
ALTER TABLE public.tasks REPLICA IDENTITY FULL;
ALTER TABLE public.subtasks REPLICA IDENTITY FULL;
-- user_stats is small enough to always be full, but for consistency:
ALTER TABLE public.user_stats REPLICA IDENTITY FULL;
