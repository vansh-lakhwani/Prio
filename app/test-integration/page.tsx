import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TestDashboard } from '@/components/test/TestDashboard'
import { ConnectionStatus } from '@/components/test/ConnectionStatus'
import { DatabaseTests } from '@/components/test/DatabaseTests'
import { RealtimeTests } from '@/components/test/RealtimeTests'
import { CRUDTests } from '@/components/test/CRUDTests'
import { ProfileTests } from '@/components/test/ProfileTests'
import { AuthTests } from '@/components/test/AuthTests'

export default async function IntegrationTestPage() {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch initial data for testing
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', user.id)

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-geist">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-10 border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden relative group">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-kinetic/5 rounded-full blur-3xl group-hover:bg-kinetic/10 transition-all duration-700" />
          <div className="relative z-10">
            <h1 className="text-5xl font-black tracking-tight text-gray-900 mb-3 bg-gradient-to-r from-gray-900 to-gray-500 bg-clip-text text-transparent">
              Integration Suite
            </h1>
            <p className="text-gray-500 font-medium max-w-md">
              A centralized dashboard to monitor, test, and verify the integrity of the Prio system across all layers.
            </p>
          </div>
          <div className="relative z-10 flex flex-col gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-200 min-w-[300px]">
             <div className="flex items-center justify-between gap-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Authenticated Agent</span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
             </div>
             <p className="text-sm font-bold text-slate-600 truncate">{user.email}</p>
             <code className="text-[10px] font-mono text-slate-400 bg-white px-2 py-1 rounded border border-slate-200 block truncate">UID: {user.id}</code>
          </div>
        </div>

        {/* Connection Status Overview */}
        <ConnectionStatus user={user} />

        {/* Test Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Authentication Tests */}
          <AuthTests user={user} authError={authError} />

          {/* Database Connection Tests */}
          <DatabaseTests profile={profile} tasks={tasks} />

          {/* Real-time Subscription Tests */}
          <RealtimeTests userId={user.id} />

          {/* CRUD Operation Tests */}
          <CRUDTests userId={user.id} />

          {/* Profile Tests */}
          <ProfileTests profile={profile} userId={user.id} />

          {/* Task Modal Tests */}
          <TestDashboard userId={user.id} />
        </div>

        {/* Instructions */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-700">
             <Shield size={120} className="text-white" />
          </div>
          <h3 className="text-3xl font-black tracking-tight mb-8 flex items-center gap-3">
             <div className="w-8 h-1 bg-kinetic rounded-full" />
             Test Protocol Reference
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
            <div className="space-y-4">
              <h4 className="font-bold text-kinetic flex items-center gap-2 tracking-wide uppercase text-xs">
                Automatic Verification
              </h4>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-3">
                   <div className="w-5 h-5 bg-white/5 rounded-full flex items-center justify-center text-[10px] font-bold text-kinetic">01</div>
                   Supabase client initialization & connection
                </li>
                <li className="flex items-center gap-3">
                   <div className="w-5 h-5 bg-white/5 rounded-full flex items-center justify-center text-[10px] font-bold text-kinetic">02</div>
                   Real-time channel subscription & heartbeat
                </li>
                <li className="flex items-center gap-3">
                   <div className="w-5 h-5 bg-white/5 rounded-full flex items-center justify-center text-[10px] font-bold text-kinetic">03</div>
                   Server-side data fetching & RLS policy check
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-blue-400 flex items-center gap-2 tracking-wide uppercase text-xs">
                Manual Validation
              </h4>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-3">
                   <div className="w-5 h-5 bg-white/5 rounded-full flex items-center justify-center text-[10px] font-bold text-blue-400">04</div>
                   Interactive CRUD cycle (Create &rarr; Update &rarr; Delete)
                </li>
                <li className="flex items-center gap-3">
                   <div className="w-5 h-5 bg-white/5 rounded-full flex items-center justify-center text-[10px] font-bold text-blue-400">05</div>
                   Cross-window real-time synchronization
                </li>
                <li className="flex items-center gap-3">
                   <div className="w-5 h-5 bg-white/5 rounded-full flex items-center justify-center text-[10px] font-bold text-blue-400">06</div>
                   Modal orchestration & component hydration
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Shield({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    </svg>
  )
}
