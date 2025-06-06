import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import LandMap from "@/components/land/LandMap";
import LandControls from "@/components/land/LandControls";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CropType, CROP_COLORS, LandPlot } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Save, Map, Sparkles } from "lucide-react";

const LandManagement = () => {
  const [plots, setPlots] = useState<LandPlot[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<CropType>("Corn");
  const [selectedColor, setSelectedColor] = useState<string>(
    CROP_COLORS["Corn"]
  );
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [savedSuccessfully, setSavedSuccessfully] = useState(false);

  const handleCropSelect = (crop: CropType, color: string) => {
    setSelectedCrop(crop);
    setSelectedColor(color);
  };

  const handleStartDrawing = () => {
    setIsDrawing(true);
  };

  const handleStopDrawing = () => {
    setIsDrawing(false);
  };

  const handlePlotComplete = (plot: LandPlot) => {
    setPlots([...plots, plot]);
    setIsDrawing(false);
  };

  const handleClearLastPlot = () => {
    if (plots.length > 0) {
      setPlots(plots.slice(0, -1));
    }
  };

  const handleSave = () => {
    // In a real app, this would save to a database
    // For now, we'll just simulate saving
    localStorage.setItem("farmPlots", JSON.stringify(plots));
    setSavedSuccessfully(true);
    setTimeout(() => {
      setShowSaveDialog(false);
      setSavedSuccessfully(false);
    }, 1500);
  };

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Modern Header Section */}
        <div className="bg-gradient-to-r from-farmlink-green/5 to-farmlink-mediumgreen/5 rounded-2xl p-8 border border-farmlink-lightgreen/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-farmlink-green to-farmlink-mediumgreen rounded-2xl flex items-center justify-center">
                <Map className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-farmlink-darkgreen">
                  Land Management
                </h1>
                <p className="text-farmlink-darkgreen/70 text-lg">
                  Manage your farm's land divisions and crop allocation
                </p>
              </div>
            </div>
            <Button
              onClick={() => setShowSaveDialog(true)}
              className="bg-gradient-to-r from-farmlink-green to-farmlink-mediumgreen hover:from-farmlink-mediumgreen hover:to-farmlink-darkgreen text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Layout
            </Button>
          </div>

          <div className="inline-flex items-center px-4 py-2 rounded-full bg-farmlink-lightgreen/20 text-farmlink-darkgreen text-sm font-medium mt-4">
            <Sparkles className="w-4 h-4 mr-2" />
            Interactive farm mapping with crop tracking
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-farmlink-green/5 to-farmlink-mediumgreen/5 border-b border-farmlink-lightgreen/20">
                <CardTitle className="text-farmlink-darkgreen">
                  Farm Layout
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <LandMap
                  selectedCrop={selectedCrop}
                  color={selectedColor}
                  isDrawing={isDrawing}
                  onPlotComplete={handlePlotComplete}
                />
              </CardContent>
            </Card>
          </div>
          <div>
            <LandControls
              onCropSelect={handleCropSelect}
              onStartDrawing={handleStartDrawing}
              onStopDrawing={handleStopDrawing}
              onClearLastPlot={handleClearLastPlot}
              isDrawing={isDrawing}
              plots={plots}
            />
          </div>
        </div>
      </div>

      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="bg-white border-farmlink-lightgreen/20">
          <DialogHeader>
            <DialogTitle className="text-farmlink-darkgreen">
              {savedSuccessfully ? "Saved Successfully!" : "Save Farm Layout"}
            </DialogTitle>
          </DialogHeader>
          {!savedSuccessfully ? (
            <div className="space-y-4 pt-4">
              <p className="text-farmlink-darkgreen/70">
                Save your current farm layout? This will overwrite any
                previously saved layouts.
              </p>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowSaveDialog(false)}
                  className="border-farmlink-lightgreen/30 text-farmlink-darkgreen hover:bg-farmlink-green/5"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-gradient-to-r from-farmlink-green to-farmlink-mediumgreen hover:from-farmlink-mediumgreen hover:to-farmlink-darkgreen text-white"
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-farmlink-green/10 text-farmlink-green mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-check"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
                <p className="text-farmlink-darkgreen">
                  Your farm layout has been saved successfully!
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default LandManagement;
