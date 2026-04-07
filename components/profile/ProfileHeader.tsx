'use client'

import { useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Camera, Mail, Calendar, Loader2, ShieldCheck, Zap, Award, CheckCircle2, LogOut } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface ProfileHeaderProps {
  user: any
  profile: any
}

export function ProfileHeader({ user, profile }: ProfileHeaderProps) {
  const [uploading, setUploading] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  // Calculate Security Score based on profile completeness
  const securityScore = useMemo(() => {
    let score = 40; // Base score for being authenticated
    if (profile?.full_name) score += 20;
    if (profile?.avatar_url) score += 15;
    if (profile?.bio) score += 15;
    if (profile?.username) score += 10;
    return score;
  }, [profile]);

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await supabase.auth.signOut()
      router.push('/login')
      toast.success('Session terminated successfully.')
    } catch (error: any) {
      toast.error('Logout failed', { description: error.message })
    } finally {
      setIsLoggingOut(false)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Math.random()}.${fileExt}`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id)

      if (updateError) throw updateError

      toast.success('Avatar updated successfully!')
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
      className="bg-surface/40 backdrop-blur-xl border border-outline/10 rounded-[2.5rem] p-8 sm:p-12 shadow-2xl overflow-hidden relative group"
    >
      {/* Dynamic Background Accents */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-kinetic/10 blur-[100px] -z-10 rounded-full animate-pulse" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/5 blur-[80px] -z-10 rounded-full" />
      
      <div className="flex flex-col lg:flex-row items-center lg:items-end gap-10">
        {/* Avatar Section */}
        <div className="relative">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="relative h-40 w-40 rounded-[3rem] overflow-hidden border-4 border-background shadow-2xl bg-gradient-to-br from-kinetic to-verdant-primary p-1"
          >
            <div className="relative w-full h-full rounded-[2.8rem] overflow-hidden bg-background">
              {profile?.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-foreground/20 text-5xl font-black font-space-grotesk">
                   {user.email?.[0].toUpperCase()}
                </div>
              )}
            </div>
            
            {(uploading || isLoggingOut) && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm z-20">
                <Loader2 className="w-10 h-10 text-kinetic animate-spin" />
              </div>
            )}
          </motion.div>

          {/* Premium Tooltip-like Badge */}
          <div className="absolute -top-3 -right-3 bg-kinetic text-background px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl border-2 border-background flex items-center gap-1.5 z-10 scale-110">
            <Zap className="w-3 h-3 fill-current" />
            <span>Pro Tier</span>
          </div>

          <label className="absolute -bottom-2 -right-2 p-3 bg-surface-highest text-foreground rounded-2xl shadow-xl cursor-pointer hover:bg-kinetic hover:text-background transition-all active:scale-95 border border-outline/10 group-hover:scale-110">
            <Camera className="h-5 w-5" />
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              disabled={uploading || isLoggingOut}
              className="hidden"
            />
          </label>
        </div>

        {/* User Info & Stats */}
        <div className="flex-1 text-center lg:text-left space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-baseline justify-center lg:justify-start gap-4">
              <h2 className="text-4xl sm:text-5xl font-black font-space-grotesk tracking-tighter text-foreground leading-none">
                {profile?.full_name || 'Anonymous Explorer'}
              </h2>
              {profile?.username && (
                <span className="text-kinetic font-black font-space-grotesk text-lg opacity-80 italic lowercase tracking-tight">
                  @{profile.username}
                </span>
              )}
            </div>
            <p className="text-foreground/40 text-lg font-medium max-w-xl mx-auto lg:mx-0">
              {profile?.bio || 'Harnessing the kinetic flow of priority-based productivity.'}
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center lg:justify-start gap-4">
            {/* Security Score Capsule */}
            <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-surface-low border border-outline/5 shadow-inner">
              <ShieldCheck className={`w-5 h-5 ${securityScore > 80 ? 'text-kinetic' : 'text-amber-500'}`} />
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-black uppercase tracking-widest text-foreground/20 leading-none mb-1">Security Score</span>
                <span className="text-sm font-black font-display text-foreground leading-none">{securityScore}% &bull; Solid</span>
              </div>
            </div>

            {/* Account Tier Capsule */}
            <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-kinetic/5 border border-kinetic/10 shadow-inner">
              <Award className="w-5 h-5 text-kinetic" />
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-black uppercase tracking-widest text-kinetic/40 leading-none mb-1">Impact Level</span>
                <span className="text-sm font-black font-display text-kinetic leading-none">Prio Vanguard</span>
              </div>
            </div>

            {/* Joined Capsule */}
            <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-surface-low border border-outline/5">
              <Calendar className="w-5 h-5 text-foreground/20" />
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-black uppercase tracking-widest text-foreground/20 leading-none mb-1">Deployment</span>
                <span className="text-sm font-black font-display text-foreground/40 leading-none">{new Date(user.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Global Task Mastery Tracker & Logout */}
        <div className="flex flex-col items-center lg:items-end gap-6 min-w-[200px]">
           <button
             onClick={handleLogout}
             disabled={isLoggingOut}
             className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-danger-standard/10 text-danger-standard hover:bg-danger-standard hover:text-white transition-all font-black uppercase tracking-widest text-[10px] shadow-lg active:scale-95 disabled:opacity-50 group/logout"
           >
             <LogOut className="w-4 h-4 group-hover/logout:translate-x-1 transition-transform" />
             Execute Termination
           </button>

           <div className="hidden xl:flex flex-col items-end gap-3 w-full">
              <div className="flex items-center gap-2">
                 <span className="text-[10px] font-black uppercase tracking-widest text-foreground/20">Operational Integrity</span>
                 <CheckCircle2 className="w-3 h-3 text-kinetic" />
              </div>
              <div className="w-full h-1.5 bg-surface-highest rounded-full overflow-hidden">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${securityScore}%` }}
                   className="h-full bg-kinetic shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                 />
              </div>
              <p className="text-[10px] font-black font-display text-foreground/10 tracking-widest">ENCRYPTED END-TO-END</p>
           </div>
        </div>
      </div>
    </motion.div>
  )
}

