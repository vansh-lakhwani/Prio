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
    <div className="bg-surface-standard/50 backdrop-blur-xl border border-outline/10 rounded-3xl p-8 h-full shadow-2xl overflow-hidden relative group">
      <div className="absolute -inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      <h2 className="text-2xl font-black font-display text-foreground mb-6 flex items-center gap-3 tracking-tight uppercase">
        <User className="h-7 w-7 text-primary" />
        Diagnostic Profile
      </h2>

      {/* Profile Data Display */}
      <div className="space-y-4 mb-8 relative z-10">
        <div className={`p-5 rounded-2xl border transition-all ${
          profile ? 'bg-primary/5 border-primary/20 shadow-inner' : 'bg-red-500/5 border-red-500/20 shadow-inner'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            {profile ? (
              <div className="bg-primary/20 p-1.5 rounded-full"><Check className="h-4 w-4 text-primary" /></div>
            ) : (
              <div className="bg-red-500/20 p-1.5 rounded-full"><X className="h-4 w-4 text-red-400" /></div>
            )}
            <span className="font-black text-foreground/60 text-[10px] uppercase tracking-[0.2em]">Profile Integrity</span>
          </div>
          {profile ? (
            <div className="text-[10px] text-foreground/40 space-y-4 font-black uppercase tracking-widest">
              <div className="bg-surface-highest/50 p-4 rounded-xl border border-outline/10">
                <p className="text-primary/40 mb-2">User Signature</p>
                <code className="text-[11px] font-mono break-all text-primary lowercase tracking-normal">{profile.id}</code>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-primary/40 mb-2">Neural Alias</p>
                  <p className="text-sm text-foreground normal-case font-medium">{profile.email || 'No email'}</p>
                </div>
                <div>
                  <p className="text-primary/40 mb-2">Architect Identity</p>
                  <p className="text-sm text-foreground normal-case font-medium">{profile.full_name || 'Not set'}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-red-600 font-bold italic">No profile data found</p>
          )}
        </div>
      </div>

      <div className="relative z-10">
        <h3 className="font-black text-foreground/40 mb-4 text-[10px] uppercase tracking-[0.3em] flex items-center gap-2">
          Sync Protocol Override
        </h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            placeholder="Identity designation..."
            className="flex-1 px-5 py-4 bg-surface-highest/30 border border-outline/10 rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary/40 outline-none transition-all placeholder:text-foreground/10 text-sm text-foreground"
          />
          <button
            onClick={testProfileUpdate}
            disabled={isUpdating}
            className="px-8 py-4 bg-primary text-background rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-primary/90 hover:shadow-2xl hover:shadow-primary/20 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isUpdating ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Override'}
          </button>
        </div>
      </div>
    </div>
  )
}
