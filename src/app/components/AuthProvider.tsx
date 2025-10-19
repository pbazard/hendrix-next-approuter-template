"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  getCurrentUser,
  fetchUserAttributes,
  signOut,
  fetchAuthSession,
} from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";

interface User {
  username: string;
  email: string;
  groups: string[];
  attributes: Record<string, any>;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  isSuperAdmin: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkUser = async () => {
    try {
      setLoading(true);
      const currentUser = await getCurrentUser();
      const attributes = await fetchUserAttributes();

      // Debug: Log all attributes to see what's available
      console.log("🔍 User attributes:", attributes);
      console.log("🔍 Current user:", currentUser);

      // Try multiple ways to get groups
      let groups: string[] = [];

      // Method 1: From cognito:groups attribute
      if (attributes["cognito:groups"]) {
        groups = attributes["cognito:groups"].split(",");
        console.log("✅ Groups from cognito:groups:", groups);
      }

      // Method 2: From custom:groups attribute (fallback)
      else if (attributes["custom:groups"]) {
        groups = attributes["custom:groups"].split(",");
        console.log("✅ Groups from custom:groups:", groups);
      }

      // Method 3: Try to get from auth session
      else {
        try {
          const session = await fetchAuthSession();
          const idToken = session.tokens?.idToken;

          console.log("🔍 Auth session:", session);
          console.log("🔍 ID Token payload:", idToken?.payload);

          if (idToken?.payload && idToken.payload["cognito:groups"]) {
            groups = idToken.payload["cognito:groups"] as string[];
            console.log("✅ Groups from auth session:", groups);
          }
        } catch (sessionError) {
          console.log("⚠️ Could not get auth session:", sessionError);
        }
      }

      console.log("🎯 Final groups array:", groups);

      setUser({
        username: currentUser.username,
        email: attributes.email || "",
        groups,
        attributes,
      });
    } catch (error) {
      console.log("No authenticated user", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUser();

    // Listen for auth events
    const unsubscribe = Hub.listen("auth", ({ payload }) => {
      switch (payload.event) {
        case "signedIn":
          checkUser();
          break;
        case "signedOut":
          setUser(null);
          break;
        case "tokenRefresh":
          checkUser();
          break;
      }
    });

    return unsubscribe;
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const isSuperAdmin = user?.groups?.includes("super_admins") || false;
  const isAdmin =
    user?.groups?.includes("admins") ||
    user?.groups?.includes("super_admins") ||
    false;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signOut: handleSignOut,
        isSuperAdmin,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
