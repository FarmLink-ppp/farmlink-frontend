import { apiClient } from "@/lib/api";
import { ApiErrorHandler } from "@/lib/error-handler";
import { Follow, FollowStatus } from "@/types/follow";
import { useEffect, useState } from "react";

interface UseFollowReturn {
  followers: Follow[];
  following: Follow[];
  followRequests: Follow[];
  isLoading: boolean;
  error: string | null;
  followUser: (userId: number) => Promise<void>;
  unfollowUser: (userId: number) => Promise<void>;
  acceptFollowRequest: (requestId: number) => Promise<void>;
  rejectFollowRequest: (requestId: number) => Promise<void>;
  refetchFollowers: () => Promise<void>;
  refetchFollowing: () => Promise<void>;
  refetchFollowRequests: () => Promise<void>;
  refetchAllFollowData: () => Promise<void>;
  clearError: () => void;
}

export const useFollow = (): UseFollowReturn => {
  const [followers, setFollowers] = useState<Follow[]>([]);
  const [following, setFollowing] = useState<Follow[]>([]);
  const [followRequests, setFollowRequests] = useState<Follow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = (error: unknown) => {
    const apiError = ApiErrorHandler.handle(error);
    setError(apiError.message);
    console.error("Follow API error:", apiError);
  };

  const fetchFollowers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.getFollowers();
      setFollowers(response);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFollowing = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.getFollowing();
      setFollowing(response);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFollowRequests = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.getFollowRequests();
      setFollowRequests(response);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const followUser = async (userId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.followUser(userId);
      if (response.status === FollowStatus.ACCEPTED) {
        await fetchFollowing();
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const unfollowUser = async (userId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await apiClient.unfollowUser(userId);
      setFollowing((prev) =>
        prev.filter((follow) => follow.followed_id !== userId)
      );
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const acceptFollowRequest = async (requestId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.acceptFollowRequest(requestId);
      setFollowRequests((prev) =>
        prev.filter((request) => request.id !== requestId)
      );
      await fetchFollowers();
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const rejectFollowRequest = async (requestId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await apiClient.rejectFollowRequest(requestId);
      setFollowRequests((prev) =>
        prev.filter((request) => request.id !== requestId)
      );
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const refetchFollowers = async () => {
    await fetchFollowers();
  };

  const refetchFollowing = async () => {
    await fetchFollowing();
  };

  const refetchFollowRequests = async () => {
    await fetchFollowRequests();
  };

  const refetchAllFollowData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await Promise.all([
        fetchFollowers(),
        fetchFollowing(),
        fetchFollowRequests(),
      ]);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    refetchAllFollowData();
  }, []);

  return {
    followers,
    following,
    followRequests,
    isLoading,
    error,
    followUser,
    unfollowUser,
    acceptFollowRequest,
    rejectFollowRequest,
    refetchFollowers,
    refetchFollowing,
    refetchFollowRequests,
    refetchAllFollowData,
    clearError,
  };
};
