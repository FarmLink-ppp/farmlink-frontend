import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import LandDivisionForm from "@/components/land/LandDivisionForm";
import LandDivisionList from "@/components/land/LandDivisionList";
import PlantForm, { CreatePlantDto } from "@/components/land/PlantForm";
import PlantList from "@/components/land/PlantList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CreateLandDivisionDto,
  LandDivision,
  Plant,
  CultivationStatus,
} from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Save, Map, Sparkles, BarChart3, Leaf } from "lucide-react";

const LandManagement = () => {
  const [divisions, setDivisions] = useState<LandDivision[]>([]);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [savedSuccessfully, setSavedSuccessfully] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreatePlant = async (data: CreatePlantDto) => {
    setIsLoading(true);

    const newPlant: Plant = {
      id: Date.now(),
      name: data.name,
      description: data.description,
      image_url: data.image_url,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setTimeout(() => {
      setPlants([...plants, newPlant]);
      setIsLoading(false);
    }, 1000);
  };

  const handleCreateDivision = async (data: CreateLandDivisionDto) => {
    setIsLoading(true);

    const selectedPlant = data.plantId
      ? plants.find((p) => p.id === data.plantId)
      : undefined;

    const newDivision: LandDivision = {
      id: Date.now(),
      name: data.name,
      area: data.area,
      cultivation_status: data.cultivationStatus,
      geolocation: data.geolocation,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      farm_id: 1,
      plant_id: data.plantId,
      plant: selectedPlant,
    };

    setTimeout(() => {
      setDivisions([...divisions, newDivision]);
      setIsLoading(false);
    }, 1000);
  };

  const handleDeleteDivision = (id: number) => {
    setDivisions(divisions.filter((d) => d.id !== id));
  };

  const handleDeletePlant = (id: number) => {
    setPlants(plants.filter((p) => p.id !== id));
    // Also update divisions that reference this plant
    setDivisions(
      divisions.map((d) =>
        d.plant_id === id ? { ...d, plant_id: undefined, plant: undefined } : d
      )
    );
  };

  const handleSave = () => {
    localStorage.setItem("landDivisions", JSON.stringify(divisions));
    localStorage.setItem("plants", JSON.stringify(plants));
    setSavedSuccessfully(true);
    setTimeout(() => {
      setShowSaveDialog(false);
      setSavedSuccessfully(false);
    }, 1500);
  };

  // Calculate statistics
  const totalArea = divisions.reduce((sum, div) => sum + div.area, 0);
  const statusCounts = divisions.reduce((acc, div) => {
    acc[div.cultivation_status] = (acc[div.cultivation_status] || 0) + 1;
    return acc;
  }, {} as Record<CultivationStatus, number>);

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header Section */}
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
                  Manage your plants and land divisions
                </p>
              </div>
            </div>
            <Button
              onClick={() => setShowSaveDialog(true)}
              className="bg-gradient-to-r from-farmlink-green to-farmlink-mediumgreen hover:from-farmlink-mediumgreen hover:to-farmlink-darkgreen text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Data
            </Button>
          </div>

          <div className="inline-flex items-center px-4 py-2 rounded-full bg-farmlink-lightgreen/20 text-farmlink-darkgreen text-sm font-medium mt-4">
            <Sparkles className="w-4 h-4 mr-2" />
            Plant cultivation and land division management
          </div>
        </div>

        <Tabs defaultValue="divisions" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/70 backdrop-blur-sm">
            <TabsTrigger
              value="divisions"
              className="data-[state=active]:bg-farmlink-green/10"
            >
              Land Divisions ({divisions.length})
            </TabsTrigger>
            <TabsTrigger
              value="plants"
              className="data-[state=active]:bg-farmlink-green/10"
            >
              Plants ({plants.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="divisions" className="mt-6">
            {/* Statistics Cards */}
            {divisions.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5 text-farmlink-green" />
                      <div>
                        <p className="text-sm text-farmlink-darkgreen/70">
                          Total Area
                        </p>
                        <p className="text-lg font-semibold text-farmlink-darkgreen">
                          {totalArea} ha
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm text-farmlink-darkgreen/70">
                          Planted
                        </p>
                        <p className="text-lg font-semibold text-farmlink-darkgreen">
                          {statusCounts[CultivationStatus.PLANTED] || 0}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div>
                        <p className="text-sm text-farmlink-darkgreen/70">
                          Harvested
                        </p>
                        <p className="text-lg font-semibold text-farmlink-darkgreen">
                          {statusCounts[CultivationStatus.HARVESTED] || 0}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                      <div>
                        <p className="text-sm text-farmlink-darkgreen/70">
                          Fallow
                        </p>
                        <p className="text-lg font-semibold text-farmlink-darkgreen">
                          {statusCounts[CultivationStatus.FALLOW] || 0}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div>
                <LandDivisionForm
                  onSubmit={handleCreateDivision}
                  plants={plants}
                  isLoading={isLoading}
                />
              </div>

              <div className="lg:col-span-2">
                <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-farmlink-green/5 to-farmlink-mediumgreen/5 border-b border-farmlink-lightgreen/20">
                    <CardTitle className="text-farmlink-darkgreen">
                      Land Divisions ({divisions.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <LandDivisionList
                      divisions={divisions}
                      onDelete={handleDeleteDivision}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="plants" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div>
                <PlantForm onSubmit={handleCreatePlant} isLoading={isLoading} />
              </div>

              <div className="lg:col-span-2">
                <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-farmlink-green/5 to-farmlink-mediumgreen/5 border-b border-farmlink-lightgreen/20">
                    <CardTitle className="text-farmlink-darkgreen flex items-center">
                      <Leaf className="mr-2 h-5 w-5" />
                      Plants ({plants.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <PlantList plants={plants} onDelete={handleDeletePlant} />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="bg-white border-farmlink-lightgreen/20">
          <DialogHeader>
            <DialogTitle className="text-farmlink-darkgreen">
              {savedSuccessfully ? "Saved Successfully!" : "Save Data"}
            </DialogTitle>
          </DialogHeader>
          {!savedSuccessfully ? (
            <div className="space-y-4 pt-4">
              <p className="text-farmlink-darkgreen/70">
                Save your plants and land divisions? This will overwrite any
                previously saved data.
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
                  Your data has been saved successfully!
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
