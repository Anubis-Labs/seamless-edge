// Authentication service for handling admin login

import { supabase } from '../lib/supabaseClient';
// Use 'import type' for importing only type information
import type { User as SupabaseUser, Session, AuthChangeEvent, AuthError } from '@supabase/supabase-js';

// Interface for application-specific user data (can be extended)
// We might need to fetch additional profile info from a 'users' or 'profiles' table later.
export interface AppUser {
  id: string;
  email?: string; // Supabase uses email as identifier
  // Add other fields like name, role if needed from your own tables
}

/**
 * Login with email and password using Supabase Auth
 */
const login = async (email: string, password: string): Promise<AppUser | null> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Supabase login error:', error.message);
    throw error; // Re-throw the error to be handled by the caller (e.g., LoginPage)
  }

  if (data.user) {
    // Map the Supabase user to our AppUser interface
    const appUser: AppUser = {
      id: data.user.id,
      email: data.user.email,
      // Fetch additional profile data here if necessary
    };
    return appUser;
  } 
  
  return null; // Should not happen if no error, but good practice
};

/**
 * Logout the current Supabase user
 */
const logout = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Supabase logout error:', error.message);
    // Optionally handle the error, e.g., show a notification
  }
  // No need to manually clear local storage, Supabase handles its session
};

/**
 * Get the current authenticated Supabase user
 */
const getCurrentUser = async (): Promise<AppUser | null> => {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    console.error('Error fetching Supabase user:', error.message);
    return null;
  }

  if (user) {
    const appUser: AppUser = {
      id: user.id,
      email: user.email,
      // Fetch additional profile data here if necessary
    };
    return appUser;
  }
  
  return null;
};

/**
 * Check if there is an active Supabase session
 */
const isAuthenticated = async (): Promise<boolean> => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error fetching Supabase session:', error.message);
      return false;
    }
    return !!session; // True if session exists, false otherwise
};

/**
 * Listen for Supabase Auth state changes
 */
const onAuthStateChange = (callback: (user: AppUser | null) => void) => {
    // Use 'any' for event and session types to bypass linter errors for now
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: any, session: any) => {
        console.log("AUTH EVENT:", event, session); // Optional: Log events for debugging
        const user = session?.user;
        if (user) {
            const appUser: AppUser = {
                id: user.id,
                email: user.email,
                // Fetch additional profile data here if necessary
            };
            callback(appUser);
        } else {
            callback(null);
        }
    });

    // Return the subscription object so the caller can unsubscribe
    return subscription;
};

/**
 * Requests a password reset email for the given email address.
 */
const requestPasswordReset = async (email: string): Promise<void> => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`, // Redirect back to this route after clicking link
  });

  if (error) {
    console.error('Supabase password reset request error:', error.message);
    throw error; // Re-throw for the UI to handle
  }
  // Success is implied if no error is thrown
};

/**
 * Updates the logged-in user's password.
 * Assumes the user arrived via a password reset link, allowing the update.
 * Supabase client handles the token verification implicitly from the URL fragment.
 */
const updatePassword = async (newPassword: string): Promise<void> => {
   const { error } = await supabase.auth.updateUser({ password: newPassword });

   if (error) {
     console.error('Supabase password update error:', error.message);
     throw error; // Re-throw for the UI to handle
   }
   // Success is implied if no error is thrown
};

const authService = {
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
  onAuthStateChange, // Add the listener export
  requestPasswordReset, // Add new function
  updatePassword,       // Add new function
};

export default authService; 