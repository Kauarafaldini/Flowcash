import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../lib/types";
import { api, setAuthToken, removeAuthToken } from "../lib/api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isRecoveringPassword: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRecoveringPassword, setIsRecoveringPassword] = useState(false);

  // Initialize from localStorage and check for password recovery flow
  useEffect(() => {
    const storedUser = localStorage.getItem("flowcash_user");
    const storedToken = localStorage.getItem("flowcash_token");
    
    // Check if we're in password recovery flow from Supabase link
    const hash = window.location.hash;
    const isPasswordRecovery = hash.includes("type=recovery") && hash.includes("access_token");
    
    if (isPasswordRecovery) {
      setIsRecoveringPassword(true);
      // Don't wait for normal auth flow when recovering password
      setLoading(false);
      return;
    }
    
    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setAuthToken(storedToken);
      } catch (e) {
        localStorage.removeItem("flowcash_user");
        localStorage.removeItem("flowcash_token");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data;

      setAuthToken(token);
      setUser(user);
      localStorage.setItem("flowcash_user", JSON.stringify(user));
      localStorage.setItem("flowcash_token", token);
    } catch (err: any) {
      const message = err.response?.data?.error || "Login failed";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setError(null);
    setLoading(true);

    try {
      const response = await api.post('/auth/signup', { name, email, password });
      const { user, token } = response.data;

      if (token) {
        setAuthToken(token);
        localStorage.setItem("flowcash_token", token);
      }
      setUser(user);
      localStorage.setItem("flowcash_user", JSON.stringify(user));
    } catch (err: any) {
      const message = err.response?.data?.error || "Signup failed";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("flowcash_user");
    localStorage.removeItem("flowcash_token");
    removeAuthToken();
    setError(null);
  };

  const resetPassword = async (email: string) => {
    setError(null);
    setLoading(true);

    try {
      await api.post('/auth/reset-password', { email });
    } catch (err: any) {
      const message = err.response?.data?.error || "Password reset failed";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (password: string) => {
    setError(null);
    setLoading(true);

    try {
      // Extract access token from URL hash
      const hash = window.location.hash;
      const tokenMatch = hash.match(/access_token=([^&]*)/);
      
      if (!tokenMatch) {
        throw new Error("Token de recuperação não encontrado");
      }

      const accessToken = tokenMatch[1];

      await api.post('/auth/update-password', { 
        password,
        access_token: accessToken
      });

      setIsRecoveringPassword(false);
      localStorage.removeItem("flowcash_user");
      localStorage.removeItem("flowcash_token");
      removeAuthToken();
      setUser(null);
    } catch (err: any) {
      const message = err.response?.data?.error || "Password update failed";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isRecoveringPassword,
        login,
        signup,
        logout,
        resetPassword,
        updatePassword,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
