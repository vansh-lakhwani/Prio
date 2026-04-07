import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { PersonalInfo } from '@/components/profile/PersonalInfo'
import { Preferences } from '@/components/profile/Preferences'
import { Integrations } from '@/components/profile/Integrations'
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
          Consolidated control center for your Prio experience. Manage your identity, preferences, and connections.
        </p>
      </section>

      {/* Profile Header (Avatar & Summary) */}
      <ProfileHeader user={user} profile={profile} />

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Core Identity */}
        <div className="space-y-8">
           <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-1.5 h-6 bg-kinetic rounded-full" />
              <h2 className="text-xl font-black font-display tracking-tight">Account & Identity</h2>
           </div>
           <PersonalInfo user={user} profile={profile} />
        </div>

        {/* Experience & Sync */}
        <div className="space-y-8">
           <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-1.5 h-6 bg-primary rounded-full" />
              <h2 className="text-xl font-black font-display tracking-tight">Workflow & Connectivity</h2>
           </div>
           <Preferences user={user} profile={profile} />
           <Integrations user={user} profile={profile} />
        </div>

      </div>

      {/* Footer Branding */}
      <div className="pt-16 pb-8 text-center text-foreground/20 font-space-grotesk font-black uppercase tracking-widest text-[10px]">
        Prio Productivity Forge &bull; Version 2.0.4 &bull; {new Date().getFullYear()}
      </div>
    </main>
  )
}
