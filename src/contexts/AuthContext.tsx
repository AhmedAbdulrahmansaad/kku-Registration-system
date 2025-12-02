import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data from users table
  const fetchUserData = async (userId: string): Promise<User | null> => {
    try {
      console.log('Fetching user data for:', userId);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user data:', error);
        // Try to get from auth metadata
        const { data: authData } = await supabase.auth.getUser();
        if (authData?.user) {
          const userMetadata = authData.user.user_metadata;
          const newUser = {
            id: authData.user.id,
            email: authData.user.email || '',
            full_name: userMetadata?.full_name || authData.user.email?.split('@')[0] || 'User',
            role: userMetadata?.role || 'student',
            student_id: null,
            major: null,
            level: null,
            created_at: new Date().toISOString(),
          };
          
          const { data: insertedUser, error: insertError } = await supabase
            .from('users')
            .insert(newUser)
            .select()
            .single();
          
          if (!insertError && insertedUser) {
            return insertedUser;
          }
        }
        return null;
      }
      
      console.log('User data fetched:', data);
      return data;
    } catch (error) {
      console.error('Error in fetchUserData:', error);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    // Check active session
    const initAuth = async () => {
      try {
        console.log('Initializing auth...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) setLoading(false);
          return;
        }
        
        if (session?.user && mounted) {
          console.log('Session found, fetching user data...');
          const userData = await fetchUserData(session.user.id);
          if (userData && mounted) {
            console.log('User set:', userData);
            setUser(userData);
          }
        }
      } catch (error) {
        console.error('Error checking auth session:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (!mounted) return;
      
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('User signed in, fetching data...');
        // Wait a bit for the user record to be created
        await new Promise(resolve => setTimeout(resolve, 1000));
        const userData = await fetchUserData(session.user.id);
        if (userData && mounted) {
          console.log('User data set after sign in:', userData);
          setUser(userData);
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        if (mounted) setUser(null);
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        const userData = await fetchUserData(session.user.id);
        if (userData && mounted) {
          setUser(userData);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log('Attempting sign in...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }

      if (data.user) {
        console.log('Sign in successful, fetching user data...');
        // Wait for user data to be available
        await new Promise(resolve => setTimeout(resolve, 1000));
        const userData = await fetchUserData(data.user.id);
        if (userData) {
          console.log('User data fetched:', userData);
          setUser(userData);
        } else {
          console.error('User data not found after sign in');
          throw new Error('User data not found');
        }
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    setLoading(true);
    try {
      console.log('Attempting sign up...', { email, role: userData.role });
      
      // Create auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.full_name,
            role: userData.role,
          },
          emailRedirectTo: window.location.origin + '/login'
        }
      });

      if (error) {
        console.error('Sign up auth error:', error);
        throw error;
      }

      if (data.user) {
        console.log('Auth user created, creating user record...');
        
        // Create user record in users table immediately
        const newUser = {
          id: data.user.id,
          email: email,
          full_name: userData.full_name || '',
          role: userData.role || 'student',
          student_id: userData.student_id || null,
          major: userData.major || null,
          level: userData.level || null,
          created_at: new Date().toISOString(),
        };

        console.log('Inserting user:', newUser);
        const { data: insertedUser, error: insertError } = await supabase
          .from('users')
          .insert(newUser)
          .select()
          .single();

        if (insertError) {
          console.error('Insert user error:', insertError);
          // If user already exists, try to fetch it
          if (insertError.code === '23505') {
            console.log('User already exists, fetching...');
            const existingUser = await fetchUserData(data.user.id);
            if (existingUser) {
              setUser(existingUser);
              return;
            }
          }
          throw insertError;
        } else if (insertedUser) {
          console.log('User created successfully:', insertedUser);
          // Wait a bit then fetch to ensure it's in the database
          await new Promise(resolve => setTimeout(resolve, 500));
          const createdUser = await fetchUserData(data.user.id);
          if (createdUser) {
            console.log('User data set after signup:', createdUser);
            setUser(createdUser);
          }
        }
      }
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('users')
        .update(data)
        .eq('id', user.id);
      
      if (error) throw error;
      
      setUser({ ...user, ...data });
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signUp,
      signOut,
      resetPassword,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
