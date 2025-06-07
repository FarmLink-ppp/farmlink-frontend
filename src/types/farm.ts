export interface CreateFarmDto {
  name: string;
  location: string;
  totalArea: number;
  areaUnit?: AreaUnit;
}

export enum AreaUnit {
  HECTARES = "HECTARES",
  ACRES = "ACRES",
  SQUARE_METERS = "SQUARE_METERS",
}

export interface FarmResponse {
  id: number;
  name: string;
  location: string;
  total_area: number;
  area_unit: AreaUnit;
  created_at: string;
  updated_at: string;
  user_id: number;
}

export interface UpdateFarmDto {
  name?: string;
  location?: string;
  totalArea?: number;
  areaUnit?: AreaUnit;
}
