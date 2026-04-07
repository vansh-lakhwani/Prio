'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User, Check, X, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

export function ProfileTests({ profile, userId }: any) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [testName, setTestName] = useState('')
  const supabase = createClient()

  const testProfileUpdate = async () => {
    if (!testName.trim()) {
      toast.error('Enter a test name first')
      return
    }

    setIsUpdating(true)

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: testName })
        .eq('id', userId)

      if (error) throw error

      toast.success('Profile updated successfully')
      setTestName('')
    } catch (error: any) {
      toast.error(`Profile update failed: ${error.message}`)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 h-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3 font-geist tracking-tight">
        <User className="h-7 w-7 text-indigo-500" />
        Profile Tests
      </h2>

      {/* Profile Data Display */}
      <div className="space-y-4 mb-8">
        <div className={`p-5 rounded-xl border-2 transition-all ${
          profile ? 'bg-indigo-50 border-indigo-100 shadow-sm' : 'bg-red-50 border-red-100 shadow-sm'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            {profile ? (
              <div className="bg-indigo-500 p-1 rounded-full"><Check className="h-4 w-4 text-white" /></div>
            ) : (
              <div className="bg-red-500 p-1 rounded-full"><X className="h-4 w-4 text-white" /></div>
            )}
            <span className="font-bold text-indigo-900 tracking-tight">Profile Integrity</span>
          </div>
          {profile ? (
            <div className="text-xs text-gray-600 space-y-3 font-medium">
              <div className="bg-white/50 p-3 rounded-lg border border-indigo-200">
                <p className="uppercase tracking-widest text-[9px] text-indigo-400 mb-1 font-bold">User UUID</p>
                <code className="text-[11px] font-mono break-all text-indigo-600">{profile.id}</code>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="uppercase tracking-widest text-[9px] text-indigo-400 mb-1 font-bold">Account Email</p>
                  <p className="text-sm text-gray-900 truncate">{profile.email || 'No email'}</p>
                </div>
                <div>
                  <p className="uppercase tracking-widest text-[9px] text-indigo-400 mb-1 font-bold">Full Name</p>
                  <p className="text-sm text-gray-900 truncate">{profile.full_name || 'Not set'}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-red-600 font-bold italic">No profile data found</p>
          )}
        </div>
      </div>

      {/* Profile Update Test */}
      <div>
        <h3 className="font-bold text-gray-900 mb-4 text-sm tracking-tight flex items-center gap-2">
          Update Profile (Test Write)
        </h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            placeholder="New test name..."
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all placeholder:text-gray-400 text-sm"
          />
          <button
            onClick={testProfileUpdate}
            disabled={isUpdating}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isUpdating ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Update'}
          </button>
        </div>
      </div>
    </div>
  )
}
