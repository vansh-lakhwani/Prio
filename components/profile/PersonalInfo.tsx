'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User, TextQuote, Save, Loader2, Edit3 } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

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

      if (error) throw error

      toast.success('Personal info updated!')
      setIsEditing(false)
      // Refresh to update header/other components
      window.location.reload()
    } catch (error: any) {
      toast.error('Update failed', { description: error.message })
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="bg-surface rounded-3xl p-6 sm:p-8 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold font-space-grotesk tracking-tight flex items-center gap-2">
            <User className="w-5 h-5 text-kinetic" />
            Personal Information
          </h3>
          <p className="text-sm text-foreground/50 mt-1">
            Manage how others see you on Prio.
          </p>
        </div>
        
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          disabled={saving}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-95 ${
            isEditing 
              ? 'bg-kinetic text-background shadow-lg shadow-kinetic/20 hover:bg-kinetic-dark' 
              : 'bg-surface text-foreground hover:bg-outline/10'
          }`}
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isEditing ? (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          ) : (
            <>
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Full Name */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-foreground/40 ml-1">
            Full Name
          </label>
          <input
            type="text"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            disabled={!isEditing || saving}
            placeholder="e.g. Alex Rivera"
            className="w-full px-4 py-3 rounded-2xl bg-background border border-outline/10 focus:border-kinetic focus:ring-1 focus:ring-kinetic outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          />
        </div>

        {/* Username */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-foreground/40 ml-1">
            Username
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30 font-bold">@</span>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              disabled={!isEditing || saving}
              placeholder="alex_rivera"
              className="w-full pl-8 pr-4 py-3 rounded-2xl bg-background border border-outline/10 focus:border-kinetic focus:ring-1 focus:ring-kinetic outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            />
          </div>
        </div>

        {/* Bio */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-foreground/40 ml-1">
            Bio
          </label>
          <div className="relative">
            <TextQuote className="absolute left-4 top-4 h-4 w-4 text-foreground/20" />
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              disabled={!isEditing || saving}
              placeholder="Tell us a little about your productivity journey..."
              rows={3}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-background border border-outline/10 focus:border-kinetic focus:ring-1 focus:ring-kinetic outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium resize-none"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

