import { apiClient } from "@/lib/api";
import { ApiErrorHandler } from "@/lib/error-handler";
import {
  CreateLandDivisionDto,
  LandDivisionResponse,
  UpdateLandDivisionDto,
} from "@/types";
import { useEffect, useState } from "react";

interface UseLandDivisionReturn {
  landDivisions: LandDivisionResponse[];
  currentLandDivision: LandDivisionResponse | null;
  isLoading: boolean;
  error: string | null;

  createLandDivision: (
    landDivisionData: CreateLandDivisionDto
  ) => Promise<void>;
  getLandDivisionById: (landDivisionId: number) => Promise<void>;
  updateLandDivision: (
    landDivisionId: number,
    landDivisionData: UpdateLandDivisionDto
  ) => Promise<void>;
  deleteLandDivision: (landDivisionId: number) => Promise<void>;
  getLandDivisionPlant: (landDivisionId: number) => Promise<void>;
  refetchLandDivisions: () => Promise<void>;

  clearCurrentLandDivision: () => void;
  clearError: () => void;
}

export const useLandDivision = (): UseLandDivisionReturn => {
  const [landDivisions, setLandDivisions] = useState<LandDivisionResponse[]>(
    []
  );
  const [currentLandDivision, setCurrentLandDivision] =
    useState<LandDivisionResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = (error: unknown) => {
    const apiError = ApiErrorHandler.handle(error);
    setError(apiError.message);
    console.error("Plant/Land Division API error:", apiError);
  };

  const fetchLandDivisions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.getLandDivisions();
      setLandDivisions(response);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const createLandDivision = async (
    landDivisionData: CreateLandDivisionDto
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.createLandDivision(landDivisionData);
      setLandDivisions((prev) => [...prev, response]);
      setCurrentLandDivision(response);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getLandDivisionById = async (landDivisionId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.getLandDivisionById(landDivisionId);
      setCurrentLandDivision(response);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateLandDivision = async (
    landDivisionId: number,
    landDivisionData: UpdateLandDivisionDto
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.updateLandDivision(
        landDivisionId,
        landDivisionData
      );
      setLandDivisions((prev) =>
        prev.map((division) =>
          division.id === landDivisionId ? response : division
        )
      );
      setCurrentLandDivision(response);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteLandDivision = async (landDivisionId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await apiClient.deleteLandDivision(landDivisionId);
      setLandDivisions((prev) =>
        prev.filter((division) => division.id !== landDivisionId)
      );
      if (currentLandDivision?.id === landDivisionId) {
        setCurrentLandDivision(null);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getLandDivisionPlant = async (landDivisionId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.getLandDivisionPlant(landDivisionId);
      setCurrentLandDivision(response);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const refetchLandDivisions = async () => {
    await fetchLandDivisions();
  };

  const clearCurrentLandDivision = () => {
    setCurrentLandDivision(null);
  };

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    fetchLandDivisions();
  }, []);

  return {
    landDivisions,
    currentLandDivision,
    isLoading,
    error,

    createLandDivision,
    getLandDivisionById,
    updateLandDivision,
    deleteLandDivision,
    getLandDivisionPlant,
    refetchLandDivisions,

    clearCurrentLandDivision,
    clearError,
  };
};
