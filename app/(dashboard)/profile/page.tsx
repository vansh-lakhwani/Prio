import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { PersonalInfo } from '@/components/profile/PersonalInfo'
import { Preferences } from '@/components/profile/Preferences'
import { NotificationSettings } from '@/components/profile/NotificationSettings'
import { TaskPreferences } from '@/components/profile/TaskPreferences'
import { Integrations } from '@/components/profile/Integrations'
import { DataManagement } from '@/components/profile/DataManagement'
import { AccountSecurity } from '@/components/profile/AccountSecurity'
import { DangerZone } from '@/components/profile/DangerZone'
import { motion } from 'framer-motion'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Profile | Prio - Secure & Kinetic Task Management',
  description: 'Manage your account settings, preferences, and productivity data.',
}

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-12 md:py-16 space-y-12">
      {/* Header Section */}
      <section className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-black font-space-grotesk tracking-tight text-foreground">
          Profile <span className="text-kinetic">& Settings</span>
        </h1>
        <p className="text-foreground/50 max-w-2xl text-lg font-medium">
          Consolidated control center for your Prio experience. Manage your identity, preferences, and data in one place.
        </p>
      </section>

      {/* Profile Header (Avatar & Summary) */}
      <ProfileHeader user={user} profile={profile} />

      {/* Settings Grid */}
      <div className="grid grid-cols-1 gap-12 pt-8">
        <PersonalInfo user={user} profile={profile} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Preferences user={user} profile={profile} />
          <NotificationSettings user={user} profile={profile} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <TaskPreferences user={user} profile={profile} />
          <Integrations user={user} profile={profile} />
        </div>

        <AccountSecurity user={user} profile={profile} />
        <DataManagement user={user} profile={profile} />
        
        <DangerZone user={user} profile={profile} />
      </div>

      {/* Footer Branding */}
      <div className="pt-16 pb-8 text-center text-foreground/20 font-space-grotesk font-black uppercase tracking-widest text-[10px]">
        Prio Productivity Forge &bull; Version 2.0.4 &bull; {new Date().getFullYear()}
      </div>
    </main>
  )
}
