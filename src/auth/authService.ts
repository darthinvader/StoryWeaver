// src/auth/authService.ts
import { supabase } from "../api/supabaseClient";
import {
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials,
} from "@supabase/supabase-js";

export const signUpUser = async (
  credentials: SignUpWithPasswordCredentials
) => {
  const { data, error } = await supabase.auth.signUp(credentials);
  if (error) {
    console.error("Supabase sign up error:", error.message);
    throw error;
  }
  // Consider email confirmation settings in Supabase
  console.log("Sign up successful, check email for confirmation if enabled.");
  return data;
};

export const signInUser = async (
  credentials: SignInWithPasswordCredentials
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

export const getCurrentSession = async () => {
  // Gets the current session data (user, access_token, etc.)
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error("Supabase getSession error:", error.message);
    // Don't throw here, often called to check status
    return { session: null };
  }
  return data;
};

export const getCurrentUser = async () => {
  // Gets the currently logged-in user object
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Supabase getUser error:", error.message);
    // Don't throw here, often called to check status
    return { user: null };
  }
  return data;
}

// You can also export supabase.auth.onAuthStateChange directly or wrap it
export const onAuthStateChange = supabase.auth.onAuthStateChange;
