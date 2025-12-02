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
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user data:', error);
        // If user doesn't exist in users table, try to create it from auth metadata
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
          
          const { data: insertedUser } = await supabase
            .from('users')
            .insert(newUser)
            .select()
            .single();
          
          return insertedUser;
        }
        return null;
      }
      return data;
    } catch (error) {
      console.error('Error in fetchUserData:', error);
      return null;
    }
  };

  useEffect(() => {
    // Check active session
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const userData = await fetchUserData(session.user.id);
          if (userData) {
            setUser(userData);
          }
        }
      } catch (error) {
        console.error('Error checking auth session:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (event === 'SIGNED_IN' && session?.user) {
        // Wait a bit for the user record to be created
        await new Promise(resolve => setTimeout(resolve, 500));
        const userData = await fetchUserData(session.user.id);
        if (userData) {
          setUser(userData);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        const userData = await fetchUserData(session.user.id);
        if (userData) {
          setUser(userData);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }

      if (data.user) {
        // Wait a bit for user data to be available
        await new Promise(resolve => setTimeout(resolve, 500));
        const userData = await fetchUserData(data.user.id);
        if (userData) {
          setUser(userData);
        } else {
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

        const { error: insertError } = await supabase.from('users').insert(newUser);

        if (insertError) {
          console.error('Insert user error:', insertError);
          // If user already exists, try to fetch it
          if (insertError.code === '23505') {
            const userData = await fetchUserData(data.user.id);
            if (userData) {
              setUser(userData);
              return;
            }
          }
        } else {
          // User created successfully, fetch it
          await new Promise(resolve => setTimeout(resolve, 500));
          const createdUser = await fetchUserData(data.user.id);
          if (createdUser) {
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
