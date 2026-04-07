import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Task } from '@/types/dashboard'
import { KanbanClientWrapper } from '@/components/kanban/KanbanClientWrapper'
import { CalendarClientWrapper } from '@/components/calendar/CalendarClientWrapper'

export default async function CalendarPage() {
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

  // Fetch Tasks
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', user.id);

  return <CalendarClientWrapper initialTasks={(tasks as Task[]) || []} />;
}
