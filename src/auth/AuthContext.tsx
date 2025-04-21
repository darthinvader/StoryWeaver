// src/auth/AuthContext.tsx
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabaseClient";
import { getCurrentSession, onAuthStateChange } from "./authService"; // Import helpers

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean; // Add loading state
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Start loading

  useEffect(() => {
    // 1. Get initial session
    getCurrentSession()
      .then(({ session }) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false); // Stop loading after initial check
      })
      .catch(() => {
        // Handle potential error during initial fetch if needed
        setLoading(false);
      });

    // 2. Listen for future auth changes
    const { data: authListener } = onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event, session);
      setSession(session);
      setUser(session?.user ?? null);
      // Optionally set loading to false again if needed,
      // but usually only needed for the initial load
      if (loading) setLoading(false);
    });

    // Cleanup listener on component unmount
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [loading]); // Rerun effect if loading changes (though primarily runs once)

  const value = {
    session,
    user,
    loading, // Provide loading state
  };

  // Don't render children until initial auth check is complete
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
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
