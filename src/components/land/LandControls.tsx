import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crop, Layers, TrashIcon, Sparkles } from "lucide-react";
import { CropType, CROP_COLORS, LandPlot } from "@/types";

interface LandControlsProps {
  onCropSelect: (crop: CropType, color: string) => void;
  onStartDrawing: () => void;
  onStopDrawing: () => void;
  onClearLastPlot: () => void;
  isDrawing: boolean;
  plots: LandPlot[];
}

const LandControls: React.FC<LandControlsProps> = ({
  onCropSelect,
  onStartDrawing,
  onStopDrawing,
  onClearLastPlot,
  isDrawing,
  plots,
}) => {
  const crops: CropType[] = ["Corn", "Wheat", "Soybeans", "Cotton", "Rice"];
  const [selectedCrop, setSelectedCrop] = useState<CropType>("Corn");

  const handleCropSelect = (crop: CropType) => {
    setSelectedCrop(crop);
    onCropSelect(crop, CROP_COLORS[crop]);
  };

  const handleDrawingToggle = () => {
    if (isDrawing) {
      onStopDrawing();
    } else {
      onStartDrawing();
    }
  };

  // Calculate total area for each crop type
  const cropAreas = plots.reduce((acc, plot) => {
    if (!acc[plot.crop]) {
      acc[plot.crop] = 0;
    }
    // This is a simplified area calculation - in a real app you'd want something more sophisticated
    const area = plot.coordinates.length > 2 ? 1 : 0; // Just count plots
    acc[plot.crop] += area;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-farmlink-green/5 to-farmlink-mediumgreen/5 border-b border-farmlink-lightgreen/20">
          <CardTitle className="text-farmlink-darkgreen flex items-center">
            <Crop className="mr-2 h-5 w-5" />
            Plot Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-medium text-farmlink-darkgreen flex items-center">
              <Sparkles className="w-4 h-4 mr-1" />
              Select Crop Type:
            </label>
            <div className="grid gap-2">
              {crops.map((crop) => (
                <Button
                  key={crop}
                  variant={selectedCrop === crop ? "default" : "outline"}
                  className={`justify-start ${
                    selectedCrop === crop
                      ? "bg-gradient-to-r from-farmlink-green to-farmlink-mediumgreen text-white"
                      : "border-farmlink-lightgreen/30 text-farmlink-darkgreen hover:bg-farmlink-green/5"
                  }`}
                  onClick={() => handleCropSelect(crop)}
                >
                  <Crop className="mr-2 h-4 w-4" />
                  <span>{crop}</span>
                  <div
                    className="ml-auto w-4 h-4 rounded-full border border-white/30"
                    style={{ backgroundColor: CROP_COLORS[crop] }}
                  />
                  {cropAreas[crop] && (
                    <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">
                      {cropAreas[crop]} plots
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Button
              className={`w-full ${
                isDrawing
                  ? "bg-gradient-to-r from-farmlink-green to-farmlink-mediumgreen text-white"
                  : "bg-white/70 border-farmlink-lightgreen/30 text-farmlink-darkgreen hover:bg-farmlink-green/5"
              }`}
              variant={isDrawing ? "default" : "outline"}
              onClick={handleDrawingToggle}
            >
              {isDrawing ? (
                <>
                  <Layers className="mr-2 h-4 w-4" />
                  Stop Drawing
                </>
              ) : (
                <>
                  <Layers className="mr-2 h-4 w-4" />
                  Start Drawing Plot
                </>
              )}
            </Button>
            <Button
              className="w-full bg-red-500/10 border-red-300/30 text-red-700 hover:bg-red-500/20"
              variant="outline"
              onClick={onClearLastPlot}
            >
              <TrashIcon className="mr-2 h-4 w-4" />
              Clear Last Plot
            </Button>
          </div>
        </CardContent>
      </Card>

      {plots.length > 0 && (
        <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-farmlink-darkgreen text-sm">
              Plot Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-2">
              <p className="text-sm text-farmlink-darkgreen/70">
                Total plots:{" "}
                <span className="font-medium text-farmlink-darkgreen">
                  {plots.length}
                </span>
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(cropAreas).map(([crop, count]) => (
                  <div key={crop} className="flex items-center justify-between">
                    <span className="text-farmlink-darkgreen/70">{crop}:</span>
                    <span className="text-farmlink-darkgreen font-medium">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LandControls;
