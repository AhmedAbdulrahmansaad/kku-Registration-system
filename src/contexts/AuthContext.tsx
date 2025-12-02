import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "../lib/supabase";
import { User } from "../types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // LOAD SESSION ON FIRST RUN
  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getSession();
      const sessionUser = data?.session?.user;

      if (sessionUser) {
        const profile = await fetchUserProfile(sessionUser.id);
        setUser(profile);
      }

      setLoading(false);
    };

    loadUser();

    // Listen to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          const profile = await fetchUserProfile(session.user.id);
          setUser(profile);
        }

        if (event === "SIGNED_OUT") {
          setUser(null);
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // FETCH USER FROM USERS TABLE
  const fetchUserProfile = async (id: string): Promise<User | null> => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("User not found:", error);
      return null;
    }

    return data;
  };

  // SIGN IN
  const signIn = async (email: string, password: string) => {
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      throw error;
    }

    if (!data.user) {
      setLoading(false);
      throw new Error("Login failed");
    }

    const profile = await fetchUserProfile(data.user.id);

    if (!profile) {
      setLoading(false);
      throw new Error("User profile missing");
    }

    setUser(profile);
    setLoading(false);
  };

  // SIGN UP
  const signUp = async (email, password, userData) => {
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: userData.full_name,
          role: userData.role,
        },
      },
    });

    if (error) {
      setLoading(false);
      throw error;
    }

    if (!data.user) {
      setLoading(false);
      throw new Error("No user returned after signup");
    }

    const newUser: User = {
      id: data.user.id,
      email,
      full_name: userData.full_name || "",
      role: userData.role || "student",
      student_id: userData.student_id || null,
      major: userData.major || null,
      level: userData.level || null,
      created_at: new Date().toISOString(),
    };

    await supabase.from("users").insert(newUser);

    setUser(newUser);
    setLoading(false);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
