// hooks/useUserProfile.ts
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import { User } from "@/types";

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

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getProfileInfo();
      setProfile(data);
    } catch (err) {
      setError("Failed to load profile");
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
