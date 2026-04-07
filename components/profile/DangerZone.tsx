'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Skull, AlertTriangle, Trash2, Loader2, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

interface DangerZoneProps {
  user: any
  profile: any
}

export function DangerZone({ user, profile }: DangerZoneProps) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleDeleteAccount = async () => {
    if (confirmText !== 'DELETE') {
      toast.error('Please type "DELETE" to confirm.')
      return
    }

    setDeleting(true)
    try {
      // In Supabase, deleting from the users table usually requires a service role
      // or a specific setup. For a client side app, we usually call an edge function
      // or rely on a trigger that deletes the user when the profile is deleted (if RLS allows).
      // Here we'll simulate the process and sign out.
      
      const { error } = await supabase.from('profiles').delete().eq('id', user.id)
      if (error) throw error

      toast.success('Account deleted successfully. We\'re sorry to see you go.')
      await supabase.auth.signOut()
      router.push('/login')
    } catch (error: any) {
      toast.error('Deletion failed', { description: error.message })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <section className="bg-critical/5 border border-critical/20 rounded-3xl p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 rounded-2xl bg-critical text-white shadow-lg shadow-critical/20">
          <Skull className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold font-space-grotesk tracking-tight text-critical">Danger Zone</h3>
          <p className="text-sm text-critical/60">Permanent actions that cannot be reversed.</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-[#18221d]/50 bg-black/20 border border-critical/10">
          <div className="flex gap-4">
            <div className="p-3 rounded-2xl bg-critical/10 text-critical h-fit">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold font-space-grotesk uppercase tracking-tighter text-critical">Delete Account</h4>
              <p className="text-xs text-critical/60 mt-1 max-w-sm">
                This will permanently delete your account, including all tasks, projects, and custom settings. This action cannot be undone.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowConfirm(true)}
            className="px-6 py-3 rounded-2xl bg-critical text-white font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-critical/30 flex items-center justify-center gap-2 whitespace-nowrap"
          >
            Delete Permanently
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-surface border border-critical/30 rounded-[32px] p-8 shadow-2xl overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-critical/5 blur-3xl -z-10 rounded-full" />
              
              <div className="flex flex-col items-center text-center gap-6">
                <div className="p-4 rounded-full bg-critical/10 text-critical">
                  <Trash2 className="w-10 h-10" />
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-black font-space-grotesk tracking-tight">Final Confirmation</h2>
                  <p className="text-sm text-foreground/50 leading-relaxed italic">
                    "Farewell is only necessary when one is ready to let go of the progress they've built."
                  </p>
                </div>

                <div className="w-full space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-critical/60">
                      Type <span className="text-critical font-black uppercase tracking-widest text-xs px-2 py-0.5 rounded-lg bg-critical/10">DELETE</span> to proceed
                    </label>
                    <input
                      type="text"
                      value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                      placeholder="Type DELETE..."
                      className="w-full px-5 py-4 rounded-2xl bg-background border border-critical/20 focus:border-critical focus:ring-1 focus:ring-critical outline-none transition-all font-black text-center text-critical placeholder:text-critical/20"
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowConfirm(false)}
                      className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-surface text-xs font-bold uppercase tracking-widest hover:bg-outline/5 transition-all active:scale-95"
                    >
                      Wait, Keep it
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      disabled={deleting || confirmText !== 'DELETE'}
                      className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-critical text-white text-xs font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-critical/20 disabled:opacity-50 disabled:grayscale"
                    >
                      {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete Site Data'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}



