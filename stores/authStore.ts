import { create } from "zustand";
import { User, Session } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";
import { createClient } from "@/lib/supabase/client";
import { subscribeToPushNotifications } from "@/lib/pwa/push";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setProfile: (profile: Profile | null) => void;
  setLoading: (isLoading: boolean) => void;
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  profile: null,
  isLoading: true,
  
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setProfile: (profile) => set({ profile }),
  setLoading: (isLoading) => set({ isLoading }),
  
  initialize: async () => {
    try {
      const supabase = createClient();
      
      // Get initial session & authenticated user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        // Only warn for unexpected errors, ignore the standard "Not logged in" error
        if (userError.message !== "Auth session missing!") {
          console.warn("No active authenticated user:", userError.message);
        }
        set({ user: null, session: null, profile: null, isLoading: false });
        return;
      }
      
      if (user) {
        // We still need the session for token data
        const { data: { session } } = await supabase.auth.getSession();
        set({ user, session });
        
        // Fetch or Create Profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
          
        if (profile) {
          set({ profile });
        } else if (profileError && profileError.code === 'PGRST116') {
          // Profile doesn't exist, create it (Safety Net)
          console.log("Profile missing, creating safety net profile...");
          const { data: newProfile, error: createError } = await supabase
            .from("profiles")
            .insert({
              id: user.id,
              email: user.email!,
              full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
              avatar_url: user.user_metadata?.avatar_url,
              theme_preference: 'system'
            })
            .select()
            .single();

          if (newProfile) {
            set({ profile: newProfile });
            console.log("Safety net profile created successfully.");
          } else {
            console.error("Failed to create safety net profile:", createError);
          }
        }
        
        // PWA Push Subscription
        setTimeout(() => subscribeToPushNotifications(), 1000);
      } else {
        set({ user: null, session: null, profile: null });
      }
      
      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event: any, currentSession: any) => {
        if (currentSession?.user) {
          set({ user: currentSession.user, session: currentSession });
          
          if (event === 'SIGNED_IN') {
             // PWA Push Subscription
             setTimeout(() => subscribeToPushNotifications(), 1000);
             
            const { data: profile, error: profileError } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", currentSession.user.id)
              .single();
              
            if (profile) {
              set({ profile });
            } else if (profileError && profileError.code === 'PGRST116') {
              // Create missing profile on sign in
              const { data: newProfile } = await supabase
                .from("profiles")
                .insert({
                  id: currentSession.user.id,
                  email: currentSession.user.email!,
                  full_name: currentSession.user.user_metadata?.full_name || currentSession.user.email?.split('@')[0] || 'User',
                  theme_preference: 'system'
                })
                .select()
                .single();

              if (newProfile) set({ profile: newProfile });
            }
          }
        } else {
          set({ user: null, session: null, profile: null });
        }
      });
      
    } catch (error) {
      console.error("Auth initialization error:", error);
    } finally {
      set({ isLoading: false });
    }
  },
  
  signOut: async () => {
    try {
      set({ isLoading: true });
      const supabase = createClient();
      await supabase.auth.signOut();
      
      // Clear all state locally
      set({ user: null, session: null, profile: null });
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      set({ isLoading: false });
    }
  }
}));
