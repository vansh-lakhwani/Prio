import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";

export function useAuth() {
  const store = useAuthStore();

  useEffect(() => {
    // Only initialize once if it hasn't been done
    if (store.isLoading && !store.user) {
      store.initialize();
    }
  }, [store]);

  return {
    user: store.user,
    session: store.session,
    profile: store.profile,
    isLoading: store.isLoading,
    signOut: store.signOut,
  };
}
