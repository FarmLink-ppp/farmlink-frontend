import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api";
import { ApiErrorHandler } from "@/lib/error-handler";

interface ProfileData {
    id: number;
    username: string;
    bio: string;
    image: string;
    location: string;
    joinDate: string; // ISO string format for the date
  }
  

interface UseProfileReturn {
  profile: ProfileData | null;
  isLoading: boolean;
  error: string | null;
  refetchProfile: () => Promise<void>;
  clearError: () => void;
}

export const useProfile = (): UseProfileReturn => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = (error: unknown) => {
    const apiError = ApiErrorHandler.handle(error);
    setError(apiError.message);
    console.error("Profile API error:", apiError);
  };

  const fetchProfile = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const profileResponse = await apiClient.getProfile();
      const userId = profileResponse.id;
       const API_BASE_URL =  "http://localhost:3000/api";
      const url = `${API_BASE_URL}/users/${userId}`;
      const config: RequestInit = { method: "GET" };

      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.statusText}`);
      }

      const data = await response.json();
      setProfile({
        id: data.id,
        username: data.username,
        bio: data.bio,
        image: data.image,
        location: data.location,
        joinDate: data.createdAt, // Assuming createdAt is the field for join date
      });
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const refetchProfile = async () => {
    await fetchProfile();
  };

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return { profile, isLoading, error, refetchProfile, clearError };
};
