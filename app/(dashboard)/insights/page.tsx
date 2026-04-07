import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { InsightsClient } from './InsightsClient';
import { Task, TaskActivity, UserStats } from '@/types/dashboard';
import { subDays } from 'date-fns';

export default async function InsightsPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  // Calculate generic bounds for the payload structure explicitly fetching 90 days.
  const ninetyDaysAgo = subDays(new Date(), 90).toISOString();

  // 1, 2, 3. Parallelize data fetching for performance
  const [tasksResult, statsResult, activityResult] = await Promise.all([
    supabase.from('tasks').select('*').eq('user_id', session.user.id),
    supabase.from('user_stats').select('*').eq('user_id', session.user.id).single(),
    supabase.from('task_activity').select('*').eq('user_id', session.user.id).gte('created_at', ninetyDaysAgo).order('created_at', { ascending: false }).limit(200),
  ]);

  const tasks = tasksResult.data;
  const stats = statsResult.data;
  const activity = activityResult.data;
    
  return (
    <InsightsClient 
      initialTasks={(tasks as Task[]) || []}
      initialStats={(stats as UserStats) || null}
      initialActivity={(activity as TaskActivity[]) || []}
    />
  );
}
