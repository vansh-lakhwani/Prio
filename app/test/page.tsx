import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { RealtimeSync } from '@/components/RealtimeSync'
import { TaskList } from '@/components/TaskList'
import { TaskModalWrapper } from '@/components/TaskModalWrapper'

export default async function TestPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#18221d] rounded-2xl shadow-sm p-8 mb-8 border border-white/50 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent tracking-tight">
                Prio - Task Manager
              </h1>
              <p className="text-gray-500 mt-2 font-medium">Your Priorities Simplified</p>
            </div>
            <RealtimeSync userId={user.id} />
          </div>
        </div>

        <div className="bg-[#18221d] rounded-2xl shadow-sm p-8 border border-white/50 backdrop-blur-xl min-h-[500px]">
          <TaskList />
        </div>

        {/* Modal Wrapper handles the floating button and the modal itself */}
        <TaskModalWrapper userId={user.id} />
      </div>
    </div>
  )
}


