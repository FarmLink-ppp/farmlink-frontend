import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateFarmDto, AreaUnit } from "@/types";
import { MapPin, Sprout, AlertCircle } from "lucide-react";

interface FarmFormProps {
  onSubmit: (farmData: CreateFarmDto) => Promise<void>;
  isLoading: boolean;
  error?: string | null;
}

const FarmForm = ({ onSubmit, isLoading, error }: FarmFormProps) => {
  const [formData, setFormData] = useState<CreateFarmDto>({
    name: "",
    location: "",
    totalArea: 0,
    areaUnit: AreaUnit.HECTARES,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.location && formData.totalArea > 0) {
      await onSubmit(formData);
    }
  };

  const handleInputChange =
    (field: keyof CreateFarmDto) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        field === "totalArea"
          ? parseFloat(e.target.value) || 0
          : e.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

  const handleAreaUnitChange = (value: AreaUnit) => {
    setFormData((prev) => ({ ...prev, areaUnit: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-farmlink-lightgreen/20 via-white to-farmlink-green/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl border-0 bg-white/90 backdrop-blur-sm shadow-2xl">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-farmlink-green to-farmlink-mediumgreen rounded-2xl flex items-center justify-center">
            <Sprout className="h-10 w-10 text-white" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold text-farmlink-darkgreen">
              Welcome to FarmLink
            </CardTitle>
            <p className="text-farmlink-darkgreen/70 text-lg mt-2">
              Let's set up your farm to get started with land management
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-farmlink-darkgreen font-medium"
              >
                Farm Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your farm name"
                value={formData.name}
                onChange={handleInputChange("name")}
                className="border-farmlink-lightgreen/30 focus:border-farmlink-green focus:ring-farmlink-green/20"
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="location"
                className="text-farmlink-darkgreen font-medium"
              >
                Location
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-farmlink-darkgreen/50" />
                <Input
                  type="text"
                  id="location"
                  placeholder="Enter your farm's address or location"
                  value={formData.location}
                  onChange={handleInputChange("location")}
                  className="pl-10 border-farmlink-lightgreen/30 focus:border-farmlink-green focus:ring-farmlink-green/20 resize-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="totalArea"
                  className="text-farmlink-darkgreen font-medium"
                >
                  Total Area
                </Label>
                <Input
                  id="totalArea"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  value={formData.totalArea || ""}
                  onChange={handleInputChange("totalArea")}
                  className="border-farmlink-lightgreen/30 focus:border-farmlink-green focus:ring-farmlink-green/20"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-farmlink-darkgreen font-medium">
                  Area Unit
                </Label>
                <Select
                  value={formData.areaUnit}
                  onValueChange={handleAreaUnitChange}
                >
                  <SelectTrigger className="border-farmlink-lightgreen/30 focus:border-farmlink-green focus:ring-farmlink-green/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={AreaUnit.HECTARES}>Hectares</SelectItem>
                    <SelectItem value={AreaUnit.ACRES}>Acres</SelectItem>
                    <SelectItem value={AreaUnit.SQUARE_METERS}>
                      Square Meters
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              type="submit"
              disabled={
                isLoading ||
                !formData.name ||
                !formData.location ||
                formData.totalArea <= 0
              }
              className="w-full bg-gradient-to-r from-farmlink-green to-farmlink-mediumgreen hover:from-farmlink-mediumgreen hover:to-farmlink-darkgreen text-white py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating Farm...</span>
                </div>
              ) : (
                "Create Farm & Continue"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FarmForm;
