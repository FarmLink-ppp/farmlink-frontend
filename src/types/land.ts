
export interface LandPlot {
  id: string;
  name: string;
  crop: string;
  color: string;
  coordinates: [number, number][];
}

export type CropType = "Corn" | "Wheat" | "Soybeans" | "Cotton" | "Rice";

export const CROP_COLORS: Record<CropType, string> = {
  Corn: "#FFD700",
  Wheat: "#DAA520",
  Soybeans: "#90EE90",
  Cotton: "#FFFFFF",
  Rice: "#D4AF37"
};
