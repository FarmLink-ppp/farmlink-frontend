import { apiClient } from "@/lib/api";
import { ApiErrorHandler } from "@/lib/error-handler";
import { CreateFarmDto, FarmResponse, UpdateFarmDto } from "@/types";
import { useEffect, useState } from "react";

interface UseFarmReturn {
  farm: FarmResponse | null;
  isLoading: boolean;
  error: string | null;
  createFarm: (farmData: CreateFarmDto) => Promise<void>;
  updateFarm: (farmData: UpdateFarmDto) => Promise<void>;
  deleteFarm: () => Promise<void>;
  refetchFarm: () => Promise<void>;
}

export const useFarm = (): UseFarmReturn => {
  const [farm, setFarm] = useState<FarmResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = (error: unknown) => {
    const apiError = ApiErrorHandler.handle(error);
    setError(apiError.message);
    console.error("Farm API error:", apiError);
  };

  const fetchFarm = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.getFarm();
      setFarm(response);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const createFarm = async (farmData: CreateFarmDto) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.createFarm(farmData);
      setFarm(response);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFarm = async (farmData: UpdateFarmDto) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.updateFarm(farmData);
      setFarm(response);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFarm = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await apiClient.deleteFarm();
      setFarm(null);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const refetchFarm = async () => {
    await fetchFarm();
  };

  useEffect(() => {
    fetchFarm();
  }, []);

  return {
    farm,
    isLoading,
    error,
    createFarm,
    updateFarm,
    deleteFarm,
    refetchFarm,
  };
};
