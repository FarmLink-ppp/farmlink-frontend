import { createContext, useEffect, useState, ReactNode } from "react";
import {
  LoginDto,
  CreateUserDto,
  EmailVerificationDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ResendEmailVerificationDto,
  ProfileResponse,
} from "@/types";

import { ApiErrorHandler } from "@/lib/error-handler";
import { apiClient } from "@/lib/api";

interface AuthContextType {
  user: ProfileResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  login: (credentials: LoginDto) => Promise<void>;
  register: (userData: CreateUserDto) => Promise<{ message: string }>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;

  verifyEmail: (data: EmailVerificationDto) => Promise<{ message: string }>;
  resendVerificationEmail: (
    data: ResendEmailVerificationDto
  ) => Promise<{ message: string }>;

  forgotPassword: (data: ForgotPasswordDto) => Promise<{ message: string }>;
  resetPassword: (data: ResetPasswordDto) => Promise<{ message: string }>;

  clearError: () => void;
  checkAuth: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<ProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user;

  const clearError = () => {
    setError(null);
  };

  const handleError = (error: unknown) => {
    const apiError = ApiErrorHandler.handle(error);
    setError(apiError.message);
    console.error("API error:", apiError);
  };

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      clearError();

      const isAuth = await apiClient.isAuthenticated();
      if (isAuth) {
        const profile = await apiClient.getProfile();
        setUser(profile);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
      console.error("Auth check failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginDto) => {
    try {
      setIsLoading(true);
      clearError();

      const response = await apiClient.login(credentials);

      const profile = await apiClient.getProfile();
      setUser(profile);
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: CreateUserDto) => {
    try {
      setIsLoading(true);
      clearError();

      const response = await apiClient.register(userData);
      return { message: response.message };
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      clearError();

      await apiClient.logout();
      setUser(null);
    } catch (error) {
      setUser(null);
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      await apiClient.refreshToken();
      const profile = await apiClient.getProfile();
      setUser(profile);
    } catch (error) {
      setUser(null);
      handleError(error);
      throw error;
    }
  };

  const verifyEmail = async (data: EmailVerificationDto) => {
    try {
      setIsLoading(true);
      clearError();

      const response = await apiClient.verifyEmail(data);
      return { message: response.message };
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerificationEmail = async (data: ResendEmailVerificationDto) => {
    try {
      setIsLoading(true);
      clearError();

      const response = await apiClient.resendVerificationEmail(data);
      return { message: response.message };
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (data: ForgotPasswordDto) => {
    try {
      setIsLoading(true);
      clearError();

      const response = await apiClient.forgotPassword(data);
      return { message: response.message };
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (data: ResetPasswordDto) => {
    try {
      setIsLoading(true);
      clearError();

      const response = await apiClient.resetPassword(data);
      return { message: response.message };
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(async () => {
      try {
        await refreshToken();
      } catch {
        setUser(null);
      }
    }, 23 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    error,

    login,
    register,
    logout,
    refreshToken,

    verifyEmail,
    resendVerificationEmail,

    forgotPassword,
    resetPassword,

    clearError,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
