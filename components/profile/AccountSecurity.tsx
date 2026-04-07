'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Shield, Key, Eye, EyeOff, Loader2, Smartphone, LogOut } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

interface AccountSecurityProps {
  user: any
  profile: any
}

export function AccountSecurity({ user, profile }: AccountSecurityProps) {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  
  const supabase = createClient()

  const handleUpdatePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ 
        password: newPassword 
      })

      if (error) throw error

      toast.success('Password updated successfully!')
      setNewPassword('')
    } catch (error: any) {
      toast.error('Failed to update password', { description: error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleSignOutAll = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signOut({ scope: 'others' })
      if (error) throw error
      toast.success('Signed out of all other sessions.')
    } catch (error: any) {
      toast.error('Sign-out failed', { description: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="bg-surface rounded-3xl p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 rounded-2xl bg-kinetic/10 text-kinetic">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold font-space-grotesk tracking-tight">Account Security</h3>
          <p className="text-sm text-foreground/50">Protect your productivity data.</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Change Password */}
        <div className="space-y-4 pt-4 border-t border-outline/5">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-foreground/30" />
            <h4 className="text-xs font-black uppercase tracking-widest text-foreground/40">Change Password</h4>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password..."
                className="w-full px-4 py-3 rounded-2xl bg-background border border-outline/10 focus:border-kinetic focus:ring-1 focus:ring-kinetic outline-none transition-all font-medium pr-12"
              />
              <button 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <button 
              onClick={handleUpdatePassword}
              disabled={loading || !newPassword}
              className="px-6 py-3 rounded-2xl bg-kinetic text-background font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-kinetic/10 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 min-w-[140px]"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update'}
            </button>
          </div>
        </div>

        {/* Sessions */}
        <div className="space-y-4 pt-4 border-t border-outline/5">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-foreground/30" />
            <h4 className="text-xs font-black uppercase tracking-widest text-foreground/40">Active Sessions</h4>
          </div>
          <div className="p-4 rounded-2xl bg-background border border-outline/10 flex items-center justify-between">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-kinetic/5 flex items-center justify-center">
                <Monitor className="w-5 h-5 text-kinetic" />
              </div>
              <div>
                <p className="text-sm font-bold">Current Session</p>
                <p className="text-[10px] uppercase tracking-widest text-kinetic font-black mt-0.5">Online Now</p>
              </div>
            </div>
            <button 
              onClick={handleSignOutAll}
              disabled={loading}
              className="p-2 gap-2 flex items-center text-xs font-bold text-foreground/40 hover:text-critical transition-colors uppercase tracking-widest"
            >
              {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <><LogOut className="w-3 h-3" /> Sign out all others</>}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

import { Monitor } from 'lucide-react'

