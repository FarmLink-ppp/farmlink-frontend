export interface CreateLandDivisionDto {
  name: string;
  area: number;
  cultivationStatus: CultivationStatus;
  geolocation: string;
  plantId?: number;
}

export interface UpdateLandDivisionDto {
  name?: string;
  area?: number;
  cultivationStatus?: CultivationStatus;
  geolocation?: string;
  plantId?: number | null;
}

export enum CultivationStatus {
  PLANTED = "PLANTED",
  HARVESTED = "HARVESTED",
  FALLOW = "FALLOW",
}

export interface LandDivisionResponse {
  id: number;
  name: string;
  area: number;
  cultivation_status: CultivationStatus;
  geolocation: string;
  farm_id: number;
  plant_id: number | null;
  plant: PlantResponse | null;
  farm?: {
    user_id: number;
  };
  created_at: string;
  updated_at: string;
}

export interface CreatePlantDto {
  name: string;
  description?: string;
  imageUrl?: string;
}

export interface UpdatePlantDto {
  name?: string;
  description?: string;
  imageUrl?: string;
}

export interface PlantResponse {
  id: number;
  name: string;
  description: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}
