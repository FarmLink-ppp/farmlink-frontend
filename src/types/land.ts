
export interface LandDivision {
  id: number;
  name: string;
  area: number;
  cultivation_status: CultivationStatus;
  geolocation: string;
  created_at: string;
  updated_at: string;
  farm_id: number;
  plant_id?: number;
  plant?: Plant;
}

export interface Plant {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export enum CultivationStatus {
  PLANTED = "PLANTED",
  HARVESTED = "HARVESTED",
  FALLOW = "FALLOW"
}

export interface CreateLandDivisionDto {
  name: string;
  area: number;
  cultivationStatus: CultivationStatus;
  geolocation: string;
  plantId?: number;
}

export interface UpdateLandDivisionDto extends Partial<CreateLandDivisionDto> {}