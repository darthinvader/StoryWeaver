import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { Session, User, Subscription } from "@supabase/supabase-js";
// Assuming subscribeToAuthStateChange is correctly typed to return { data: { subscription: Subscription } }
import { subscribeToAuthStateChange } from "./authService";

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
  // Initialize loading to true, as we need to wait for the initial auth state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set loading to true when the effect runs (component mounts)
    setLoading(true);

    // Subscribe to auth state changes.
    // The callback will be invoked immediately with the current session state,
    // and then again whenever the auth state changes.
    const { data } = subscribeToAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      // Set loading to false once we have the initial auth state (or lack thereof)
      setLoading(false);
    });

    const authSubscription: Subscription | null = data?.subscription ?? null;

    // Cleanup function: Unsubscribe when the component unmounts
    return () => {
      authSubscription?.unsubscribe();
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount

  const value = {
    session,
    user,
    loading,
  };

  // Render children only when loading is complete to prevent rendering
  // components that might rely on auth state before it's determined.
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
