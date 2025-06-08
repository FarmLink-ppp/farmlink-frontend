import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import { User } from "@/types";
import { ApiErrorHandler } from "@/lib/error-handler";

interface UseUserProfileReturn {
  profile: User | null;
  loading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  clearError: () => void;
}

export const useUserProfile = (): UseUserProfileReturn => {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleError = (error: unknown) => {
    const apiError = ApiErrorHandler.handle(error);
    setError(apiError.message);
    console.error("Profile API error:", apiError);
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      clearError();
      const data = await apiClient.getProfileInfo();
      setProfile(data);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
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

  return { profile, loading, error, fetchProfile: refetchProfile, clearError };
};
