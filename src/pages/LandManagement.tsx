
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import LandMap from '@/components/land/LandMap';
import LandControls from '@/components/land/LandControls';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CropType, CROP_COLORS, LandPlot } from '@/types/land';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

const LandManagement = () => {
  const [plots, setPlots] = useState<LandPlot[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<CropType>("Corn");
  const [selectedColor, setSelectedColor] = useState<string>(CROP_COLORS["Corn"]);
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
    localStorage.setItem('farmPlots', JSON.stringify(plots));
    setSavedSuccessfully(true);
    setTimeout(() => {
      setShowSaveDialog(false);
      setSavedSuccessfully(false);
    }, 1500);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Land Management</h1>
            <p className="text-muted-foreground mt-1">Manage your farm's land divisions and crops</p>
          </div>
          <Button onClick={() => setShowSaveDialog(true)} variant="outline">
            <Save className="mr-2 h-4 w-4" />
            Save Layout
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Farm Layout</CardTitle>
              </CardHeader>
              <CardContent>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{savedSuccessfully ? "Saved Successfully!" : "Save Farm Layout"}</DialogTitle>
          </DialogHeader>
          {!savedSuccessfully ? (
            <div className="space-y-4 pt-4">
              <p>Save your current farm layout? This will overwrite any previously saved layouts.</p>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowSaveDialog(false)}>Cancel</Button>
                <Button onClick={handleSave}>Save</Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
                </div>
                <p>Your farm layout has been saved successfully!</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default LandManagement;
