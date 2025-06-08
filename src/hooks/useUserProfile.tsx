// hooks/useUserProfile.ts
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';

export const useUserProfile = () => {
  const [profile, setProfile] = useState<{
    username?: string;
    full_name?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiClient.getProfile1();
        setProfile(data);
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  console.log(profile);
  return { profile, loading, error };
};