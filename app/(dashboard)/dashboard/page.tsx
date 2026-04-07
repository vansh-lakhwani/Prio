export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { DashboardClient } from '@/components/dashboard/DashboardClient'
import { redirect } from 'next/navigation'
import { Task, UserStats, TaskActivity } from '@/types/dashboard'

export default async function DashboardPage() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  // 1. Fetch Tasks
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*, subtasks(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  // 2. Fetch User Stats
  const { data: stats } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', user.id)
    .single();

  // 3. Fetch Recent Activity
  const { data: activity } = await supabase
    .from('task_activity')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10);

  // Default structure if no stats exist yet (though triggger should create it)
  const defaultStats: UserStats = {
    id: 'default',
    user_id: user.id,
    total_tasks_completed: 0,
    current_streak: 0,
    longest_streak: 0,
    last_activity_date: new Date().toISOString(),
    productivity_score: 0
  };

  return (
    <DashboardClient 
      userId={user.id}
      initialTasks={(tasks as Task[]) || []} 
      initialStats={(stats as UserStats) || defaultStats} 
      initialActivity={(activity as TaskActivity[]) || []} 
    />
  );
}
