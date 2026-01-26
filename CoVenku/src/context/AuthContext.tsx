"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "@/services/api";

interface User {
  id: number;
  name: string;
  role: string;
  addressId: number;
  birth: string;
  male: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userData?: User) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem("auth_token");
      if (savedToken) {
        setToken(savedToken);
        try {
          const userData = await getCurrentUser();
          if (userData?.data) {
            setUser(userData.data);
          }
        } catch (error) {
          console.error("Failed to fetch user:", error);
          localStorage.removeItem("auth_token");
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (newToken: string, userData?: User) => {
    localStorage.setItem("auth_token", newToken);
    sessionStorage.setItem("loggedUser", "true");
    setToken(newToken);

    // Always fetch fresh user data after login
    try {
      const fetchedUser = await getCurrentUser();
      if (fetchedUser?.data) {
        setUser(fetchedUser.data);
      } else if (userData) {
        // Fallback to provided user data if fetch fails
        setUser(userData);
      }
    } catch (error) {
      console.error("Failed to fetch user after login:", error);
      // Use provided user data as fallback
      if (userData) {
        setUser(userData);
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    sessionStorage.removeItem("loggedUser");
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    if (token) {
      try {
        const userData = await getCurrentUser();
        if (userData?.data) {
          setUser(userData.data);
        }
      } catch (error) {
        console.error("Failed to refresh user:", error);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
        refreshUser,
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
