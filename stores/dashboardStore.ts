import { create } from 'zustand';
import { Task, UserStats, TaskActivity } from '@/types/dashboard';
import { createClient } from '@/lib/supabase/client';

interface DashboardState {
  tasks: Task[];
  stats: UserStats | null;
  activity: TaskActivity[];
  isLoading: boolean;
  isRealtimeConnected: boolean;
  userId: string | null;
  
  // Actions
  setInitialData: (tasks: Task[], stats: UserStats | null, activity: TaskActivity[], userId?: string) => void;
  updateTaskOptimistic: (id: string, updates: Partial<Task>) => void;
  addTaskOptimistic: (task: Task) => void;
  removeTaskOptimistic: (id: string) => void;
  setTasksOptimistic: (tasks: Task[]) => void;
  refetchTasks: () => Promise<void>;
  
  // Async thunks
  toggleTaskCompletion: (id: string, currentStatus: Task['status']) => Promise<void>;
  syncTaskPositions: (payloads: {id: string, status: string, position: number}[]) => Promise<void>;
  rescheduleTask: (id: string, newDate: string | null) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  
  // Subtasks
  updateSubtaskOptimistic: (taskId: string, subtaskId: string, updates: Partial<any>) => void;
  addSubtaskOptimistic: (taskId: string, subtask: any) => void;
  removeSubtaskOptimistic: (taskId: string, subtaskId: string) => void;
  
  // Realtime initialization
  initRealtime: () => void;
  cleanupRealtime: () => void;
}

// Single instance to avoid multiple subscriptions
let realtimeChannel: any = null;

export const useDashboardStore = create<DashboardState>((set, get) => ({
  tasks: [],
  stats: null,
  activity: [],
  isLoading: true,
  isRealtimeConnected: false,
  userId: null,

  setInitialData: (tasks, stats, activity, userId) => set({ tasks, stats, activity, isLoading: false, ...(userId ? { userId } : {}) }),

  refetchTasks: async () => {
    const uid = get().userId;
    if (!uid) return;
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*, subtasks(*)')
        .eq('user_id', uid)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      if (data) {
        set({ tasks: data as Task[] });
      }
    } catch (error) {
      console.error('[Store] Failed to refetch tasks:', error);
    }
  },

  updateTaskOptimistic: (id, updates) => set((state) => {
    const existing = state.tasks.find(t => t.id === id);
    
    // If incoming update has a timestamp, compare it with existing state
    if (existing && updates.updated_at) {
      const incomingTime = new Date(updates.updated_at).getTime();
      const existingTime = new Date(existing.updated_at).getTime();
      
      // If server data is older than current UI state, skip it (likely a stale Realtime event)
      if (incomingTime < existingTime) {
        console.warn(`[Realtime] Stale update for task ${id.slice(0, 8)}: incoming ${updates.updated_at} < existing ${existing.updated_at}`);
        return state;
      }
    }
    
    // Merge updates and ensure the latest timestamp is preserved
    const newTasks = state.tasks.map((t) => (t.id === id ? { 
      ...t, 
      ...updates, 
      updated_at: updates.updated_at || new Date().toISOString() 
    } : t));
    
    return { tasks: newTasks };
  }),

  addTaskOptimistic: (task) => set((state) => ({
    tasks: [task, ...state.tasks]
  })),

  removeTaskOptimistic: (id) => set((state) => ({
    tasks: state.tasks.filter((t) => t.id !== id)
  })),

  setTasksOptimistic: (tasks) => set({ tasks }),

  updateSubtaskOptimistic: (taskId, subtaskId, updates) => set((state) => ({
    tasks: state.tasks.map((t) => (t.id === taskId ? { 
      ...t, 
      subtasks: t.subtasks?.map((st) => (st.id === subtaskId ? { ...st, ...updates, updated_at: new Date().toISOString() } : st))
    } : t))
  })),

  addSubtaskOptimistic: (taskId, subtask) => set((state) => ({
    tasks: state.tasks.map((t) => (t.id === taskId ? {
      ...t,
      subtasks: [...(t.subtasks || []), subtask]
    } : t))
  })),

  removeSubtaskOptimistic: (taskId, subtaskId) => set((state) => ({
    tasks: state.tasks.map((t) => (t.id === taskId ? {
      ...t,
      subtasks: t.subtasks?.filter((st) => st.id !== subtaskId)
    } : t))
  })),

  syncTaskPositions: async (payloads) => {
    const supabase = createClient();
    
    await Promise.all(payloads.map(payload => 
      supabase.from('tasks').update({ status: payload.status, position: payload.position }).eq('id', payload.id)
    ));
  },

  rescheduleTask: async (id, newDate) => {
    get().updateTaskOptimistic(id, { due_date: newDate, updated_at: new Date().toISOString() });
    const supabase = createClient();
    const { error } = await supabase
      .from('tasks')
      .update({ due_date: newDate })
      .eq('id', id);
    if (error) {
      console.error('Failed to reschedule task:', error);
      get().refetchTasks();
    }
  },

  deleteTask: async (id) => {
    const taskSnapshot = get().tasks.find(t => t.id === id);
    get().removeTaskOptimistic(id);

    const supabase = createClient();
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Failed to delete task:', error);
      if (taskSnapshot) get().addTaskOptimistic(taskSnapshot);
    }
  },

  toggleTaskCompletion: async (id, currentStatus) => {
    const isCompleted = currentStatus === 'done';
    const newStatus = isCompleted ? 'todo' : 'done';
    const completedAt = isCompleted ? null : new Date().toISOString();
    const updatedAt = new Date().toISOString();
    
    console.log(`[Store] Toggling task ${id.slice(0, 8)} to ${newStatus}`);
    
    // Optimistic Update with local timestamp
    get().updateTaskOptimistic(id, { status: newStatus, completed_at: completedAt, updated_at: updatedAt });

    const supabase = createClient();
    const { error } = await supabase
      .from('tasks')
      .update({ status: newStatus, completed_at: completedAt })
      .eq('id', id);

    if (error) {
      console.error('[Store] Failed to toggle task:', error);
      // Revert with old status but fresh timestamp to ensure UI reflects the revert accurately
      get().updateTaskOptimistic(id, { status: currentStatus, completed_at: isCompleted ? new Date().toISOString() : null, updated_at: new Date().toISOString() });
    }
  },

  initRealtime: () => {
    const { userId } = get();
    if (!userId) {
      console.error('[Realtime] Cannot initialize: userId is missing');
      return;
    }

    if (realtimeChannel) {
      console.log('[Realtime] Channel already exists, using existing channel.');
      return;
    }

    const supabase = createClient();
    console.log('[Realtime] Initializing for user:', userId);

    realtimeChannel = supabase.channel(`db_sync_${userId.slice(0, 8)}`)
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'tasks',
          filter: `user_id=eq.${userId}`
        },
        (payload: any) => {
          const { eventType, new: newRecord, old: oldRecord } = payload;
          console.log(`[Realtime] Received ${eventType} event for task:`, newRecord?.id || oldRecord?.id);
          
          if (eventType === 'INSERT') {
            get().addTaskOptimistic(newRecord as Task);
          } else if (eventType === 'UPDATE') {
            // Already timestamp-checked inside updateTaskOptimistic
            get().updateTaskOptimistic((newRecord as Task).id, newRecord as Partial<Task>);
          } else if (eventType === 'DELETE') {
            get().removeTaskOptimistic((oldRecord as Task).id);
          }
        }
      )
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'subtasks' 
          // Note: subtasks don't have user_id, relying on RLS for filtering
        },
        (payload: any) => {
          const { eventType, new: newRecord, old: oldRecord } = payload;
          console.log('[Realtime] Subtask event received:', eventType, newRecord?.id || oldRecord?.id);
          if (eventType === 'INSERT') {
            get().addSubtaskOptimistic((newRecord as any).task_id, newRecord);
          } else if (eventType === 'UPDATE') {
            get().updateSubtaskOptimistic((newRecord as any).task_id, (newRecord as any).id, newRecord);
          } else if (eventType === 'DELETE') {
            get().removeSubtaskOptimistic((oldRecord as any).task_id, (oldRecord as any).id);
          }
        }
      )
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'user_stats',
          filter: `user_id=eq.${userId}`
        },
        (payload: any) => {
          console.log('[Realtime] Stats update received');
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            set({ stats: payload.new as UserStats });
          }
        }
      )
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'task_activity',
          filter: `user_id=eq.${userId}`
        },
        (payload: any) => {
          set((state) => ({ activity: [payload.new as TaskActivity, ...state.activity].slice(0, 50) }));
        }
      )
      .subscribe((status: string, err?: Error) => {
        console.log(`[Realtime] Subscription status: ${status}`);
        
        if (status === 'SUBSCRIBED') {
          console.log('[Realtime] Successfully connected to database changes.');
          set({ isRealtimeConnected: true });
        } else if (status === 'CLOSED') {
          console.warn('[Realtime] Connection closed.');
          set({ isRealtimeConnected: false });
          realtimeChannel = null;
        } else if (status === 'CHANNEL_ERROR') {
          console.error('[Realtime] Connection error:', err?.message || 'Unknown error');
          set({ isRealtimeConnected: false });
          // Cleanup on error to allow re-initialization
          realtimeChannel = null; 
        }
      });
  },

  cleanupRealtime: () => {
    if (realtimeChannel) {
      console.log('[Realtime] Cleaning up channel...');
      const supabase = createClient();
      supabase.removeChannel(realtimeChannel);
      realtimeChannel = null;
      set({ isRealtimeConnected: false });
    }
  }
}));
