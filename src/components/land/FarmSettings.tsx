import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings, MapPin, AlertCircle, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { AreaUnit, UpdateFarmDto, FarmResponse } from "@/types";

interface FarmSettingsProps {
  farm: FarmResponse;
  onUpdateFarm: (farmData: UpdateFarmDto) => Promise<void>;
  isLoading?: boolean;
}

const FarmSettings = ({
  farm,
  onUpdateFarm,
  isLoading = false,
}: FarmSettingsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<UpdateFarmDto>({
    name: farm.name,
    location: farm.location,
    totalArea: farm.total_area,
    areaUnit: farm.area_unit,
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: farm.name,
        location: farm.location,
        totalArea: farm.total_area,
        areaUnit: farm.area_unit,
      });
      setError(null);
      setSuccessMessage(false);
    }
  }, [farm, isOpen]);

  const handleInputChange =
    (field: keyof UpdateFarmDto) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        field === "totalArea"
          ? parseFloat(e.target.value) || 0
          : e.target.value;

      setFormData((prev) => ({ ...prev, [field]: value }));
      setError(null);
    };

  const handleAreaUnitChange = (value: AreaUnit) => {
    setFormData((prev) => ({ ...prev, areaUnit: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name?.trim()) {
      setError("Farm name is required");
      return;
    }

    if (!formData.location?.trim()) {
      setError("Location is required");
      return;
    }

    if (!formData.totalArea || formData.totalArea <= 0) {
      setError("Total area must be greater than 0");
      return;
    }

    setIsSubmitting(true);

    try {
      await onUpdateFarm(formData);
      setSuccessMessage(true);

      setTimeout(() => {
        setIsOpen(false);
        setSuccessMessage(false);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update farm");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: farm.name,
      location: farm.location,
      totalArea: farm.total_area,
      areaUnit: farm.area_unit,
    });
    setError(null);
    setSuccessMessage(false);
    setIsOpen(false);
  };

  const getAreaUnitDisplay = (unit: AreaUnit) => {
    switch (unit) {
      case AreaUnit.HECTARES:
        return "Hectares";
      case AreaUnit.ACRES:
        return "Acres";
      case AreaUnit.SQUARE_METERS:
        return "Square Meters";
      default:
        return unit;
    }
  };

  const hasChanges = () => {
    return (
      formData.name !== farm.name ||
      formData.location !== farm.location ||
      formData.totalArea !== farm.total_area ||
      formData.areaUnit !== farm.area_unit
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-farmlink-green/30 text-farmlink-darkgreen hover:bg-farmlink-green/5 transition-colors"
          disabled={isLoading}
        >
          <Settings className="mr-2 h-4 w-4" />
          Farm Settings
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] bg-white border-farmlink-lightgreen/20">
        <DialogHeader>
          <DialogTitle className="text-farmlink-darkgreen flex items-center">
            <Settings className="mr-2 h-5 w-5" />
            Farm Settings
          </DialogTitle>
          <DialogDescription className="text-farmlink-darkgreen/70">
            Update your farm information. Changes will be applied immediately.
          </DialogDescription>
        </DialogHeader>

        {successMessage ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-farmlink-green/10 text-farmlink-green mb-4">
                <Check className="h-6 w-6" />
              </div>
              <p className="text-farmlink-darkgreen font-medium">
                Farm updated successfully!
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="farm-name"
                  className="text-farmlink-darkgreen font-medium"
                >
                  Farm Name
                </Label>
                <Input
                  id="farm-name"
                  type="text"
                  placeholder="Enter farm name"
                  value={formData.name || ""}
                  onChange={handleInputChange("name")}
                  className="border-farmlink-lightgreen/30 focus:border-farmlink-green focus:ring-farmlink-green/20"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="farm-location"
                  className="text-farmlink-darkgreen font-medium"
                >
                  Location
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-farmlink-darkgreen/50" />
                  <Input
                    id="farm-location"
                    type="text"
                    placeholder="Enter farm location"
                    value={formData.location || ""}
                    onChange={handleInputChange("location")}
                    className="pl-10 border-farmlink-lightgreen/30 focus:border-farmlink-green focus:ring-farmlink-green/20"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="farm-area"
                    className="text-farmlink-darkgreen font-medium"
                  >
                    Total Area
                  </Label>
                  <Input
                    id="farm-area"
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    value={formData.totalArea || ""}
                    onChange={handleInputChange("totalArea")}
                    className="border-farmlink-lightgreen/30 focus:border-farmlink-green focus:ring-farmlink-green/20"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-farmlink-darkgreen font-medium">
                    Area Unit
                  </Label>
                  <Select
                    value={formData.areaUnit}
                    onValueChange={handleAreaUnitChange}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="border-farmlink-lightgreen/30 focus:border-farmlink-green focus:ring-farmlink-green/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={AreaUnit.HECTARES}>
                        {getAreaUnitDisplay(AreaUnit.HECTARES)}
                      </SelectItem>
                      <SelectItem value={AreaUnit.ACRES}>
                        {getAreaUnitDisplay(AreaUnit.ACRES)}
                      </SelectItem>
                      <SelectItem value={AreaUnit.SQUARE_METERS}>
                        {getAreaUnitDisplay(AreaUnit.SQUARE_METERS)}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <DialogFooter className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="border-farmlink-lightgreen/30 text-farmlink-darkgreen hover:bg-farmlink-green/5"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !hasChanges()}
                className="bg-gradient-to-r from-farmlink-green to-farmlink-mediumgreen hover:from-farmlink-mediumgreen hover:to-farmlink-darkgreen text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Updating...</span>
                  </div>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FarmSettings;
