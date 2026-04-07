-- Migration: Add due_date and priority metadata to subtasks
ALTER TABLE public.subtasks 
ADD COLUMN IF NOT EXISTS due_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'none' CHECK (priority IN ('low', 'medium', 'high', 'none'));
