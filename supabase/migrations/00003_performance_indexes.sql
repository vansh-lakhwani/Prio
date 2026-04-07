-- Performance Optimization Indexes
-- Created for Prio v2 Production readiness

-- 1. Tasks optimization
-- Frequent filtering by user_id and status
CREATE INDEX IF NOT EXISTS idx_tasks_user_status ON public.tasks (user_id, status);
-- Filtering by due_date for calendar and dashboard
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON public.tasks (due_date) WHERE due_date IS NOT NULL;
-- Joining with projects
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON public.tasks (project_id) WHERE project_id IS NOT NULL;

-- 2. Subtasks optimization
-- Joining with tasks
CREATE INDEX IF NOT EXISTS idx_subtasks_task_id ON public.subtasks (task_id);

-- 3. Projects 
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects (user_id);

-- 4. Search performance
CREATE INDEX IF NOT EXISTS idx_tasks_title_search ON public.tasks USING gin (to_tsvector('english', title));
