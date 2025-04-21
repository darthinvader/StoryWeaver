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

    getCurrentSession()
      .then(({ session: initialSession }) => {
        if (isMounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
        }
      })
      .catch((err) => {
        console.error("Error fetching initial session:", err);
        if (isMounted) {
          setLoading(false);
        }
      })
      .finally(() => {
        if (!isMounted) return;

        try {
          const { data } = subscribeToAuthStateChange(
            (_event, currentSession) => {
              if (isMounted) {
                setSession(currentSession);
                setUser(currentSession?.user ?? null);
                if (loading) setLoading(false);
              }
            },
          );
          authSubscription = data?.subscription ?? null;
          if (isMounted) setLoading(false);
        } catch (error) {
          console.error("Failed to subscribe to auth state changes:", error);
          if (isMounted) setLoading(false);
        }
      });

    return () => {
      isMounted = false;
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, [loading]); // Added loading dependency to potentially re-run if initial load fails before subscribe

  const value = {
    session,
    user,
    loading,
  };

  // Render children only when loading is complete
  return (
    <AuthContext.Provider value={value}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
