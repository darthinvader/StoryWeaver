// src/auth/AuthContext.tsx
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { Session, User, Subscription } from "@supabase/supabase-js";

import { getCurrentSession, subscribeToAuthStateChange } from "./authService";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let authSubscription: Subscription | null = null;

    // 1. Get initial session
    getCurrentSession()
      .then(({ session: initialSession }) => {
        if (isMounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          // Don't setLoading(false) here yet, wait for subscription setup
        }
      })
      .catch((err) => {
        console.error("Error fetching initial session:", err);
        // Still need to stop loading if initial fetch fails
        if (isMounted) {
          setLoading(false);
        }
      })
      .finally(() => {
        // 2. Attempt to subscribe *after* initial session check completes
        if (!isMounted) return; // Don't subscribe if already unmounted

        try {
          const { data } = subscribeToAuthStateChange(
            (_event, currentSession) => {
              if (isMounted) {
                console.log("Auth state changed:", _event, currentSession);
                setSession(currentSession);
                setUser(currentSession?.user ?? null);
                // Ensure loading is false once we receive the first auth state update
                // or after successful subscription setup.
                if (loading) setLoading(false);
              }
            },
          );
          authSubscription = data?.subscription ?? null;
          // Set loading to false after successful subscription setup
          if (isMounted) setLoading(false);
        } catch (error) {
          // Catch errors thrown by subscribeToAuthStateChange
          console.error("Failed to subscribe to auth state changes:", error);
          // Handle subscription error appropriately
          if (isMounted) setLoading(false); // Stop loading if subscription fails
        }
      });

    // Cleanup listener on component unmount
    return () => {
      isMounted = false;
      if (authSubscription) {
        console.log("Unsubscribing from auth state changes.");
        authSubscription.unsubscribe();
      }
    };
  }, []); // Empty dependency array

  const value = {
    session,
    user,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
