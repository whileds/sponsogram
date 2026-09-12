"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "creator" | "manager" | "mentor" | "admin";
  avatar?: string;
  package: "CREATOR LITE" | "CREATOR PLUS" | "CREATOR PREMIUM" | null;
  status: "submitted" | "under_review" | "approved" | "rejected" | "waitlisted" | null;
  socialHandle: string;
  platform: string;
  niche: string;
  followerCount: string;
  assignedManager?: {
    name: string;
    email: string;
    avatar: string;
    role: string;
  } | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Maps the Prisma `Role` enum (CREATOR | MANAGER | MENTOR | ADMIN) to the
// lowercase role string every existing component already expects.
const roleToLower = (role: string): User["role"] =>
  role.toLowerCase() as User["role"];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<User | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!session?.user) {
      setProfile(null);
      return;
    }

    setProfileLoading(true);
    try {
      // Only creators have the extended profile bundle (plan, status, manager, etc).
      if (session.user.role === "CREATOR") {
        const res = await fetch("/api/creators/me");
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        } else {
          // Session exists but profile fetch failed — fall back to a minimal user
          setProfile({
            id: session.user.id,
            name: session.user.name ?? "",
            email: session.user.email ?? "",
            role: roleToLower(session.user.role),
            avatar: session.user.image ?? undefined,
            package: null,
            status: null,
            socialHandle: "",
            platform: "",
            niche: "",
            followerCount: "",
            assignedManager: null,
          });
        }
      } else {
        setProfile({
          id: session.user.id,
          name: session.user.name ?? "",
          email: session.user.email ?? "",
          role: roleToLower(session.user.role),
          avatar: session.user.image ?? undefined,
          package: null,
          status: null,
          socialHandle: "",
          platform: "",
          niche: "",
          followerCount: "",
          assignedManager: null,
        });
      }
    } finally {
      setProfileLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const login = async (email: string, password: string) => {
  const res = await signIn("credentials", {
    email,
    password,
    redirect: false,
  });

  if (res?.error) {
    return {
      ok: false,
      error: "Invalid email or password",
    };
  }

  // Don't fetch the profile here.
  // useEffect will fetch it when the session updates.
  return { ok: true };
};

  const logout = async () => {
    await signOut({ redirect: false });
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user: profile,
        isAuthenticated: !!session?.user,
        isLoading: status === "loading" || profileLoading,
        login,
        logout,
        refresh: fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
