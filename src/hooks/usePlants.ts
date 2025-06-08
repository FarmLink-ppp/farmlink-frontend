import { apiClient } from "@/lib/api";
import { ApiErrorHandler } from "@/lib/error-handler";
import { CreatePlantDto, PlantResponse, UpdatePlantDto } from "@/types";
import { set } from "date-fns";
import { useEffect, useState } from "react";

interface UsePlantReturn {
  plants: PlantResponse[];
  plantsCount: number;
  currentPlant: PlantResponse | null;
  isLoading: boolean;
  error: string | null;

  createPlant: (plantData: CreatePlantDto) => Promise<void>;
  getAllPlants: () => Promise<void>;
  getPlantsCount: () => Promise<void>;
  getPlantById: (plantId: number) => Promise<void>;
  updatePlant: (plantId: number, plantData: UpdatePlantDto) => Promise<void>;
  deletePlant: (plantId: number) => Promise<void>;

  clearCurrentPlant: () => void;
  clearError: () => void;
}

export const usePlant = (): UsePlantReturn => {
  const [plants, setPlants] = useState<PlantResponse[]>([]);
  const [plantsCount, setPlantsCount] = useState<number>(0);
  const [currentPlant, setCurrentPlant] = useState<PlantResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = (error: unknown) => {
    const apiError = ApiErrorHandler.handle(error);
    setError(apiError.message);
    console.error("Plant Division API error:", apiError);
  };

  const createPlant = async (plantData: CreatePlantDto) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.createPlant(plantData);
      setCurrentPlant(response);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAllPlants = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.getAllPlants();
      setPlants(response);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPlantById = async (plantId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.getPlantById(plantId);
      setCurrentPlant(response);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePlant = async (plantId: number, plantData: UpdatePlantDto) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.updatePlant(plantId, plantData);
      setCurrentPlant(response);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const deletePlant = async (plantId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await apiClient.deletePlant(plantId);
      if (currentPlant?.id === plantId) {
        setCurrentPlant(null);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPlantsCount = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const count = await apiClient.getPlantCount();
      setPlantsCount(count);
    } catch (error) {
      handleError(error);
      setPlantsCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  const clearCurrentPlant = () => {
    setCurrentPlant(null);
  };

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    getAllPlants();
  }, []);

  return {
    plants,
    plantsCount,
    currentPlant,
    isLoading,
    error,

    createPlant,
    getAllPlants,
    getPlantsCount,
    getPlantById,
    updatePlant,
    deletePlant,

    clearCurrentPlant,
    clearError,
  };
};
