'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User, TextQuote, Save, Loader2, Edit3, AtSign, Fingerprint, Zap } from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

interface PersonalInfoProps {
  user: any
  profile: any
}

export function PersonalInfo({ user, profile }: PersonalInfoProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    bio: profile?.bio || '',
    username: profile?.username || ''
  })
  const [saving, setSaving] = useState(false)
  
  const supabase = createClient()

  const handleSave = async () => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          bio: formData.bio,
          username: formData.username,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) {
        if (error.message.includes('column') || error.message.includes('not found')) {
           toast.error('Database Out of Sync', {
             description: 'Backend migration required for full_name/bio/username. Please run the provided SQL script.'
           })
        } else {
           throw error
        }
      } else {
        toast.success('Identity profile synchronized!')
        setIsEditing(false)
        // Refresh to update header/other components
        setTimeout(() => window.location.reload(), 1000)
      }
    } catch (error: any) {
      toast.error('Update failed', { description: error.message })
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="bg-surface/50 backdrop-blur-md border border-outline/10 rounded-[2.5rem] p-8 sm:p-10 shadow-xl relative overflow-hidden group">
      {/* Visual Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-kinetic/5 blur-3xl -z-10 rounded-full group-hover:scale-150 transition-transform duration-1000" />
      
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-[1.25rem] bg-kinetic/10 text-kinetic shadow-inner">
            <Fingerprint className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-black font-space-grotesk tracking-tight text-foreground">
              Core Identity
            </h3>
            <p className="text-sm text-foreground/40 font-medium">
              Your cryptographic identity and public persona.
            </p>
          </div>
        </div>
        
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          disabled={saving}
          className={`group/btn flex items-center gap-3 px-6 py-3 rounded-2xl text-sm font-black font-display tracking-widest uppercase transition-all active:scale-95 shadow-lg ${
            isEditing 
              ? 'bg-kinetic text-background shadow-kinetic/20 hover:bg-kinetic-dark' 
              : 'bg-surface-highest text-foreground hover:bg-kinetic hover:text-background'
          }`}
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isEditing ? (
            <>
              <Save className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
              Sync Changes
            </>
          ) : (
            <>
              <Edit3 className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
              Edit Profile
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Full Name */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20 ml-1">
            Display Name
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/20" />
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              disabled={!isEditing || saving}
              placeholder="e.g. Alex Rivera"
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-background/50 border border-outline/10 focus:border-kinetic focus:ring-1 focus:ring-kinetic outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold text-foreground placeholder:text-foreground/10"
            />
          </div>
        </div>

        {/* Username */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20 ml-1">
            Public Handle
          </label>
          <div className="relative">
            <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/20" />
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              disabled={!isEditing || saving}
              placeholder="alex_rivera"
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-background/50 border border-outline/10 focus:border-kinetic focus:ring-1 focus:ring-kinetic outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold text-foreground placeholder:text-foreground/10"
            />
          </div>
        </div>

        {/* Bio */}
        <div className="md:col-span-2 space-y-3">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20 ml-1">
            Productivity Mission (Bio)
          </label>
          <div className="relative group/bio">
            <TextQuote className="absolute left-4 top-5 h-4 w-4 text-foreground/20 group-focus-within/bio:text-kinetic transition-colors" />
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              disabled={!isEditing || saving}
              placeholder="Define your vision, goals, and drive..."
              rows={3}
              className="w-full pl-12 pr-4 py-4 rounded-3xl bg-background/50 border border-outline/10 focus:border-kinetic focus:ring-1 focus:ring-kinetic outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium text-foreground resize-none leading-relaxed"
            />
          </div>
        </div>
      </div>
      
      {/* Decorative Branding */}
      <div className="mt-10 pt-10 border-t border-outline/5 flex items-center gap-2 opacity-10 uppercase text-[9px] font-black tracking-[0.5em]">
        <Zap className="w-3 h-3" />
        Identity Signature Protocol 2.0
      </div>
    </section>
  )
}

