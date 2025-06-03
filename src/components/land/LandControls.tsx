
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crop, Layers, Save, TrashIcon } from "lucide-react";
import { CropType, CROP_COLORS, LandPlot } from '@/types/land';

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
  plots
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
    <Card>
      <CardHeader>
        <CardTitle>Plot Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Crop Type:</label>
          <div className="grid gap-2">
            {crops.map((crop) => (
              <Button
                key={crop}
                variant={selectedCrop === crop ? "default" : "outline"}
                className="justify-start"
                onClick={() => handleCropSelect(crop)}
              >
                <Crop className="mr-2 h-4 w-4" />
                <span>{crop}</span>
                <div
                  className="ml-auto w-4 h-4 rounded-full"
                  style={{ backgroundColor: CROP_COLORS[crop] }}
                />
                {cropAreas[crop] && (
                  <span className="ml-2 text-xs">{cropAreas[crop]} plots</span>
                )}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          <Button 
            className="w-full" 
            variant={isDrawing ? "default" : "secondary"}
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
            className="w-full" 
            variant="destructive"
            onClick={onClearLastPlot}
          >
            <TrashIcon className="mr-2 h-4 w-4" />
            Clear Last Plot
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LandControls;
