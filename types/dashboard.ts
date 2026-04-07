export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';
export type TaskPriority = 'none' | 'low' | 'medium' | 'high';
export type TaskCategory = { id: string, name: string, color: string };
export type TaskLabel = { id: string, name: string, color: string };

export interface Subtask {
  id: string;
  task_id?: string;
  title: string;
  completed: boolean;
  due_date?: string | null;
  priority?: TaskPriority;
  created_at?: string;
  updated_at?: string;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  completed_at?: string | null;
  position: number;
  project_id?: string | null;
  category_id?: string | null; // Deprecated
  tag?: string | null;
  google_event_id?: string | null;
  reminder_at?: string | null;
  is_recurring?: boolean;
  recurrence_pattern?: any | null;
  created_at: string;
  updated_at: string;
  
  // Extended fields for Modals
  labels?: string[];
  subtasks?: Subtask[];
}

export interface UserStats {
  id: string;
  user_id: string;
  total_tasks_completed: number;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string;
  productivity_score: number;
}

export interface TaskActivity {
  id: string;
  task_id: string;
  user_id: string;
  action: 'created' | 'updated' | 'completed' | 'deleted';
  changes: any;
  created_at: string;
}

// Minimal category interface
export interface Category {
  id: string;
  user_id: string;
  name: string;
  color: string;
  icon: string | null;
  created_at: string;
}
