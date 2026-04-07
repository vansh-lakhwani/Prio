'use client'

import { createClient } from '@/lib/supabase/client'
import { LogOut, Shield, Check, AlertCircle, Mail, Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { useMounted } from '@/lib/hooks/useMounted'

export function AuthTests({ user, authError }: any) {
  const router = useRouter()
  const supabase = createClient()
  const mounted = useMounted()

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error(`Sign out failed: ${error.message}`)
    } else {
      toast.success('Signed out successfully')
      router.push('/login')
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 h-full transition-all hover:shadow-xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3 font-geist tracking-tight">
        <Shield className="h-7 w-7 text-green-500" />
        Authentication Tests
      </h2>

      <div className="space-y-4">
        {/* Auth Status */}
        <div className={`p-5 rounded-xl border-2 transition-all ${
          user && !authError ? 'bg-green-50 border-green-100 shadow-sm' : 'bg-red-50 border-red-100 shadow-sm'
        }`}>
          <div className="flex items-center gap-3 mb-2">
            {user && !authError ? (
              <div className="bg-green-500 p-1 rounded-full text-white">
                <Check className="h-4 w-4" />
              </div>
            ) : (
              <div className="bg-red-500 p-1 rounded-full text-white">
                <AlertCircle className="h-4 w-4" />
              </div>
            )}
            <span className="font-bold text-gray-900 tracking-tight">
              {user && !authError ? 'Session Active' : 'Session Revoked'}
            </span>
          </div>
          {authError && (
            <p className="text-sm text-red-600 font-bold mt-2 animate-pulse">{authError.message}</p>
          )}
        </div>

        {/* User Session Info */}
        {user && (
          <div className="p-5 bg-blue-50 border border-blue-100 rounded-xl space-y-4 shadow-inner">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-blue-500" />
              <div>
                <p className="uppercase tracking-widest text-[9px] text-blue-400 font-bold">Email Address</p>
                <p className="text-sm text-blue-900 font-semibold">{user.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-blue-500" />
              <div>
                <p className="uppercase tracking-widest text-[9px] text-blue-400 font-bold">Last Sign In</p>
                <p className="text-sm text-blue-900 font-semibold">
                  {mounted ? new Date(user.last_sign_in_at).toLocaleString() : 'Loading...'}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-blue-100 flex items-center justify-between">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-tighter">Verified</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${user.email_confirmed_at ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {user.email_confirmed_at ? 'CONFIRMED' : 'PENDING'}
              </span>
            </div>
          </div>
        )}

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 hover:shadow-lg active:scale-[0.98] transition-all group mt-2"
        >
          <LogOut className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          Test Session End (Sign Out)
        </button>
      </div>
    </div>
  )
}
