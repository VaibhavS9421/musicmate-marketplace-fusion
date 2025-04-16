
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

type UserRole = 'buyer' | 'seller' | null;

interface UserRoleContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isLoading: boolean;
}

// Create context with default values
const UserRoleContext = createContext<UserRoleContextType>({
  userRole: null,
  setUserRole: () => {},
  session: null,
  user: null,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
  isLoading: true,
});

export const UserRoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state safely with null defaults
  const [userRole, setUserRoleState] = useState<UserRole>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Create a function to update both state and localStorage
  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
    if (role) {
      try {
        localStorage.setItem('userRole', role);
      } catch (error) {
        console.error('Error setting userRole in localStorage:', error);
      }
    } else {
      try {
        localStorage.removeItem('userRole');
      } catch (error) {
        console.error('Error removing userRole from localStorage:', error);
      }
    }
  };

  // Authentication methods
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            ...userData,
            role: userRole
          }
        }
      });
      return { error };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUserRole(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Initialize auth state
  useEffect(() => {
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsLoading(false);
        
        // Initialize user role from localStorage if logged in but no role is set
        if (currentSession?.user && !userRole) {
          try {
            const storedRole = localStorage.getItem('userRole') as UserRole;
            if (storedRole) {
              setUserRoleState(storedRole);
            }
          } catch (error) {
            console.error('Error accessing localStorage:', error);
          }
        }
      }
    );

    // Then check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Get role from localStorage if available
        try {
          if (currentSession?.user) {
            const storedRole = localStorage.getItem('userRole') as UserRole;
            if (storedRole) {
              setUserRoleState(storedRole);
            }
          }
        } catch (error) {
          console.error('Error accessing localStorage:', error);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing auth:', error);
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      // Clean up subscription when the component unmounts
      subscription.unsubscribe();
    };
  }, []);

  return (
    <UserRoleContext.Provider value={{ 
      userRole, 
      setUserRole, 
      session, 
      user, 
      signIn, 
      signUp, 
      signOut,
      isLoading
    }}>
      {children}
    </UserRoleContext.Provider>
  );
};

export const useUserRole = (): UserRoleContextType => {
  const context = useContext(UserRoleContext);
  if (context === undefined) {
    throw new Error('useUserRole must be used within a UserRoleProvider');
  }
  return context;
};
