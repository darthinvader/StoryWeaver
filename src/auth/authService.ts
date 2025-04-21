import { supabase } from "../api/supabaseClient";
import {
  AuthChangeEvent,
  Session,
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials,
  Subscription,
  User,
  AuthError,
} from "@supabase/supabase-js";

export const signUpUser = async (
  credentials: SignUpWithPasswordCredentials,
) => {
  const { data, error } = await supabase.auth.signUp(credentials);
  if (error) {
    console.error("Supabase sign up error:", error.message);
    throw error;
  }
  // Consider removing console logs for production builds or using a proper logger
  console.log("Sign up successful, check email for confirmation if enabled.");
  return data;
};

export const signInUser = async (
  credentials: SignInWithPasswordCredentials,
) => {
  const { data, error } = await supabase.auth.signInWithPassword(credentials);
  if (error) {
    console.error("Supabase sign in error:", error.message);
    throw error;
  }
  console.log("Sign in successful.");
  return data;
};

export const signOutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Supabase sign out error:", error.message);
    throw error;
  }
  console.log("Sign out successful.");
};

export const getCurrentSession = async (): Promise<{ session: Session | null }> => {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error("Supabase getSession error:", error.message);
    return { session: null }; // Don't throw, return null as per promise type
  }
  return { session: data.session };
};

export const getCurrentUser = async (): Promise<{ user: User | null }> => {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Supabase getUser error:", error.message);
    return { user: null }; // Don't throw, return null as per promise type
  }
  return { user: data.user };
};

/**
 * Subscribes to Supabase auth state changes.
 *
 * @param callback - The function to execute when the auth state changes.
 *                   It receives the event type and the session object (or null).
 * @returns An object containing the subscription data: { data: { subscription: Subscription } }.
 *          This allows unsubscribing later.
 * @throws {AuthError | Error} If Supabase fails to set up the listener.
 */
export const subscribeToAuthStateChange = (
  callback: (event: AuthChangeEvent, session: Session | null) => void,
): { data: { subscription: Subscription } } => {
  try {
    const result = supabase.auth.onAuthStateChange(callback);

    if (!result?.data?.subscription) {
      console.error(
        "onAuthStateChange succeeded but returned unexpected structure:",
        result,
      );
      throw new Error(
        "Failed to get subscription object from onAuthStateChange.",
      );
    }
    return { data: result.data };
  } catch (error) {
    console.error("Error subscribing to auth state changes:", error);
    if (error instanceof AuthError) {
      throw error;
    } else if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("An unknown error occurred during auth subscription.");
    }
  }
};
