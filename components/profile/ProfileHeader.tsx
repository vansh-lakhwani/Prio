'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Camera, Mail, Calendar, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface ProfileHeaderProps {
  user: any
  profile: any
}

export function ProfileHeader({ user, profile }: ProfileHeaderProps) {
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)

    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Math.random()}.${fileExt}`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id)

      if (updateError) throw updateError

      toast.success('Avatar updated successfully!')
      // In a real app, we'd update the state or use a hook, 
      // but for simplicity and to match user request:
      window.location.reload()
    } catch (error: any) {
      console.error('Error uploading avatar:', error)
      toast.error('Failed to upload avatar', {
        description: error.message === 'Bucket not found' 
          ? 'Storage bucket "avatars" is not configured yet.' 
          : error.message
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface rounded-3xl p-8 shadow-sm overflow-hidden relative group"
    >
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-kinetic/5 blur-3xl -z-10 rounded-full" />
      
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        {/* Avatar */}
        <div className="relative">
          <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-background shadow-xl bg-gradient-to-br from-kinetic to-verdant-primary">
            {profile?.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt="Profile"
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-background text-4xl font-black font-space-grotesk">
                {user.email?.[0].toUpperCase()}
              </div>
            )}
            
            {uploading && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            )}
          </div>

          {/* Upload Button */}
          <label className="absolute bottom-0 right-0 p-2 bg-kinetic text-background rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform active:scale-95 border-2 border-background">
            <Camera className="h-5 w-5" />
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>

        {/* User Info */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-black font-space-grotesk tracking-tight text-foreground">
              {profile?.full_name || 'Anonymous User'}
            </h2>
            <p className="text-foreground/50 font-medium">
              {profile?.bio || 'Productivity explorer at Prio.'}
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface text-sm text-foreground/70 shadow-sm">
              <Mail className="h-4 w-4 text-kinetic" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface text-sm text-foreground/70 shadow-sm">
              <Calendar className="h-4 w-4 text-kinetic" />
              <span>Joined {new Date(user.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

