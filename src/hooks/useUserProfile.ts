import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import {
  MessageResponse,
  UpdateAccountType,
  UpdatePasswordDto,
  UpdateProfileInformationDto,
  User,
} from "@/types";
import { ApiErrorHandler } from "@/lib/error-handler";

interface UseUserProfileReturn {
  profile: User | null;
  loading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfileInfo: (
    data: UpdateProfileInformationDto,
    file?: File | null
  ) => Promise<User>;
  updatePassword: (data: UpdatePasswordDto) => Promise<MessageResponse>;
  updateAccountType: (data: UpdateAccountType) => Promise<User>;
  deleteAccount: () => Promise<MessageResponse>;
  clearError: () => void;
  isUpdating: boolean;
}

export const useUserProfile = (): UseUserProfileReturn => {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = (error: unknown) => {
    const apiError = ApiErrorHandler.handle(error);
    setError(apiError.message);
    console.error("Profile API error:", apiError);
  };

  const fetchProfile = async () => {
    try {
      clearError();
      setLoading(true);
      const data = await apiClient.getProfileInfo();
      setProfile(data);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const updateProfileInfo = async (
    data: UpdateProfileInformationDto,
    file: File | null = null
  ): Promise<User> => {
    try {
      clearError();
      setIsUpdating(true);
      const updatedUser = await apiClient.updateProfileInformation(data, file);
      setProfile(updatedUser);
      return updatedUser;
    } catch (err) {
      handleError(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const updatePassword = async (
    data: UpdatePasswordDto
  ): Promise<MessageResponse> => {
    try {
      clearError();
      setIsUpdating(true);
      const response = await apiClient.updatePassword(data);
      return response;
    } catch (err) {
      handleError(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const updateAccountType = async (data: UpdateAccountType): Promise<User> => {
    try {
      clearError();
      setIsUpdating(true);
      const updatedUser = await apiClient.updateAccountType(data);
      setProfile(updatedUser);
      return updatedUser;
    } catch (err) {
      handleError(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteAccount = async (): Promise<MessageResponse> => {
    try {
      clearError();
      setIsUpdating(true);
      const response = await apiClient.deleteAccount();
      setProfile(null);
      return response;
    } catch (err) {
      handleError(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const refetchProfile = async () => {
    await fetchProfile();
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    error,
    fetchProfile: refetchProfile,
    clearError,
    updateProfileInfo,
    updateAccountType,
    updatePassword,
    deleteAccount,
    isUpdating,
  };
};
