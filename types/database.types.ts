export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          color: string | null
          created_at: string | null
          icon: string | null
          id: string
          name: string
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          name: string
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          name?: string
          user_id?: string
        }
      }
      labels: {
        Row: {
          color: string | null
          created_at: string | null
          id: string
          name: string
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          id?: string
          name: string
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          id?: string
          name?: string
          user_id?: string
        }
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          theme_preference: "light" | "dark" | "system" | null
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          theme_preference?: "light" | "dark" | "system" | null
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          theme_preference?: "light" | "dark" | "system" | null
          timezone?: string | null
          updated_at?: string | null
        }
      }
      subtasks: {
        Row: {
          completed: boolean | null
          created_at: string | null
          id: string
          position: number | null
          task_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          position?: number | null
          task_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          position?: number | null
          task_id?: string
          title?: string
          updated_at?: string | null
        }
      }
      task_activity: {
        Row: {
          action: "created" | "updated" | "completed" | "deleted" | null
          changes: Json | null
          created_at: string | null
          id: string
          task_id: string
          user_id: string
        }
        Insert: {
          action?: "created" | "updated" | "completed" | "deleted" | null
          changes?: Json | null
          created_at?: string | null
          id?: string
          task_id: string
          user_id: string
        }
        Update: {
          action?: "created" | "updated" | "completed" | "deleted" | null
          changes?: Json | null
          created_at?: string | null
          id?: string
          task_id?: string
          user_id?: string
        }
      }
      task_labels: {
        Row: {
          label_id: string
          task_id: string
        }
        Insert: {
          label_id: string
          task_id: string
        }
        Update: {
          label_id?: string
          task_id?: string
        }
      }
      tasks: {
        Row: {
          category_id: string | null
          completed_at: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          is_recurring: boolean | null
          position: number | null
          priority: "low" | "medium" | "high" | "none" | null
          recurrence_pattern: Json | null
          status: "todo" | "in_progress" | "review" | "done" | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          is_recurring?: boolean | null
          position?: number | null
          priority?: "low" | "medium" | "high" | "none" | null
          recurrence_pattern?: Json | null
          status?: "todo" | "in_progress" | "review" | "done" | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          is_recurring?: boolean | null
          position?: number | null
          priority?: "low" | "medium" | "high" | "none" | null
          recurrence_pattern?: Json | null
          status?: "todo" | "in_progress" | "review" | "done" | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
      }
      user_stats: {
        Row: {
          current_streak: number | null
          id: string
          last_activity_date: string | null
          longest_streak: number | null
          productivity_score: number | null
          total_tasks_completed: number | null
          user_id: string
        }
        Insert: {
          current_streak?: number | null
          id?: string
          last_activity_date?: string | null
          longest_streak?: number | null
          productivity_score?: number | null
          total_tasks_completed?: number | null
          user_id: string
        }
        Update: {
          current_streak?: number | null
          id?: string
          last_activity_date?: string | null
          longest_streak?: number | null
          productivity_score?: number | null
          total_tasks_completed?: number | null
          user_id?: string
        }
      }
    }
  }
}
