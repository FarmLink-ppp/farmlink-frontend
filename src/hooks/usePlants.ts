import { apiClient } from "@/lib/api";
import { ApiErrorHandler } from "@/lib/error-handler";
import { CreatePlantDto, PlantResponse } from "@/types";
import { useEffect, useState } from "react";

interface UsePlantReturn {
  plants: PlantResponse[];
  currentPlant: PlantResponse | null;
  isLoading: boolean;
  error: string | null;

  createPlant: (plantData: CreatePlantDto) => Promise<void>;
  getAllPlants: () => Promise<void>;
  getPlantById: (plantId: number) => Promise<void>;
  updatePlant: (plantId: number, plantData: CreatePlantDto) => Promise<void>;
  deletePlant: (plantId: number) => Promise<void>;

  clearCurrentPlant: () => void;
  clearError: () => void;
}

export const usePlant = (): UsePlantReturn => {
  const [plants, setPlants] = useState<PlantResponse[]>([]);
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

  const updatePlant = async (plantId: number, plantData: CreatePlantDto) => {
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
    currentPlant,
    isLoading,
    error,

    createPlant,
    getAllPlants,
    getPlantById,
    updatePlant,
    deletePlant,

    clearCurrentPlant,
    clearError,
  };
};
