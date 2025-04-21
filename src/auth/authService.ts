// src/auth/authService.ts
import { supabase } from "../api/supabaseClient"; // Correct path based on structure
import {
  AuthChangeEvent, // Import necessary types
  Session,
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials,
  Subscription,
  User,
  AuthError, // Import AuthError for better catch typing
} from "@supabase/supabase-js";

// --- signUpUser, signInUser, signOutUser, getCurrentSession, getCurrentUser ---
// --- (These functions remain the same as the previous correct version) ---

export const signUpUser = async (
  credentials: SignUpWithPasswordCredentials,
) => {
  const { data, error } = await supabase.auth.signUp(credentials);
  if (error) {
    console.error("Supabase sign up error:", error.message);
    throw error;
  }
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
    return { session: null };
  }
  return { session: data.session };
};

export const getCurrentUser = async (): Promise<{ user: User | null }> => {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Supabase getUser error:", error.message);
    return { user: null };
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
    // Call the Supabase function. It returns { data: { subscription } } on success.
    // It will THROW an error if setup fails.
    const result = supabase.auth.onAuthStateChange(callback);

    // --- REMOVED THE DESTRUCTURING WITH 'error' ---

    // Check if the expected structure is returned on success
    if (!result?.data?.subscription) {
      // This case should be unlikely if no error was thrown, but good to check
      console.error(
        "onAuthStateChange succeeded but returned unexpected structure:",
        result,
      );
      throw new Error(
        "Failed to get subscription object from onAuthStateChange.",
      );
    }

    // Return the successful result structure as defined by the types
    return { data: result.data };

  } catch (error) {
    // Catch any error thrown by supabase.auth.onAuthStateChange
    console.error("Error subscribing to auth state changes:", error);
    // Re-throw the error to be handled by the caller (AuthContext)
    // You might want to check if it's an AuthError for specific handling
    if (error instanceof AuthError) {
      throw error; // Re-throw specific Supabase auth error
    } else if (error instanceof Error) {
      throw error; // Re-throw generic error
    } else {
      // Handle cases where the thrown object might not be an Error instance
      throw new Error("An unknown error occurred during auth subscription.");
    }
  }
};
