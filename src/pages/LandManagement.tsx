import { useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import LandDivisionForm from "@/components/land/LandDivisionForm";
import LandDivisionList from "@/components/land/LandDivisionList";
import PlantForm from "@/components/land/PlantForm";
import PlantList from "@/components/land/PlantList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CreateLandDivisionDto,
  CreatePlantDto,
  CultivationStatus,
  UpdateFarmDto,
  UpdateLandDivisionDto,
  UpdatePlantDto,
} from "@/types";
import { CreateFarmDto } from "@/types";
import { useFarm } from "@/hooks/useFarm";
import { useLandDivision } from "@/hooks/useLandDivisions";
import { usePlant } from "@/hooks/usePlants";
import { Map, Sparkles, BarChart3, Leaf, MapPin, Calendar } from "lucide-react";
import FarmForm from "@/components/land/FarmForm";
import FarmSettings from "@/components/land/FarmSettings";
import DeleteFarm from "@/components/land/DeleteFarm";
import { toast } from "@/hooks/use-toast";

const LandManagement = () => {
  const {
    farm,
    isLoading: farmLoading,
    error: farmError,
    createFarm,
    updateFarm,
    deleteFarm,
  } = useFarm();

  const {
    landDivisions,
    isLoading: landDivisionLoading,
    error: landDivisionError,
    createLandDivision,
    updateLandDivision,
    deleteLandDivision,
    refetchLandDivisions,
    clearError: clearLandDivisionError,
  } = useLandDivision();

  const {
    plants,
    isLoading: plantLoading,
    error: plantError,
    createPlant,
    deletePlant,
    getAllPlants,
    updatePlant,
    clearError: clearPlantError,
  } = usePlant();

  const handleCreateFarm = async (farmData: CreateFarmDto) => {
    await createFarm(farmData);
    await refetchLandDivisions();
  };

  const handleUpdateFarm = async (farmData: UpdateFarmDto) => {
    await updateFarm(farmData);
  };

  const handleDeleteFarm = async () => {
    await deleteFarm();
    await refetchLandDivisions();
    await getAllPlants();
  };

  const handleCreatePlant = async (data: CreatePlantDto) => {
    await createPlant(data);
    await getAllPlants();
  };

  const handleCreateDivision = async (data: CreateLandDivisionDto) => {
    await createLandDivision(data);
    await refetchLandDivisions();
  };

  const handleEditLandDivision = async (
    id: number,
    data: UpdateLandDivisionDto
  ) => {
    await updateLandDivision(id, data);
    await refetchLandDivisions();
  };

  const handleDeleteDivision = async (id: number) => {
    await deleteLandDivision(id);
  };

  const handleEditPlant = async (id: number, data: UpdatePlantDto) => {
    await updatePlant(id, data);
    await getAllPlants();
  };

  const handleDeletePlant = async (id: number) => {
    await deletePlant(id);
    await getAllPlants();
    await refetchLandDivisions();
  };

  const clearError = () => {
    clearLandDivisionError();
    clearPlantError();
  };

  const totalArea = landDivisions.reduce((sum, div) => sum + div.area, 0);
  const statusCounts = landDivisions.reduce((acc, div) => {
    acc[div.cultivation_status] = (acc[div.cultivation_status] || 0) + 1;
    return acc;
  }, {} as Record<CultivationStatus, number>);

  const error = farmError || landDivisionError || plantError;

  useEffect(() => {
    if (error) {
      if (error === "Farm not found") return;
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
      clearError();
    }
  }, [error, clearError]);

  if (farmLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-4 border-farmlink-green/30 border-t-farmlink-green rounded-full animate-spin mx-auto" />
            <p className="text-farmlink-darkgreen/70">
              Loading your farm information...
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!farm) {
    return (
      <FarmForm
        onSubmit={handleCreateFarm}
        isLoading={farmLoading}
        error={farmError}
      />
    );
  }

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <p className="text-red-800 text-sm">{error}</p>
              <button
                onClick={clearError}
                className="text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="bg-gradient-to-r from-farmlink-green/5 to-farmlink-mediumgreen/5 rounded-2xl p-8 border border-farmlink-lightgreen/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-farmlink-green to-farmlink-mediumgreen rounded-2xl flex items-center justify-center">
                <Map className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-farmlink-darkgreen">
                  {farm.name}
                </h1>
                <p className="text-farmlink-darkgreen/70 text-lg">
                  Land Management Dashboard
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FarmSettings
                farm={farm}
                onUpdateFarm={handleUpdateFarm}
                isLoading={farmLoading}
              />
              <DeleteFarm
                farm={farm}
                onDeleteFarm={handleDeleteFarm}
                isLoading={farmLoading}
              />
            </div>
          </div>

          {/* Farm Info Bar */}
          <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-farmlink-darkgreen/80">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>{farm.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>
                {farm.total_area} {farm.area_unit.toLowerCase()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>
                Created {new Date(farm.created_at).toLocaleDateString()}
              </span>
            </div>
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
              Land Divisions ({landDivisions.length})
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
            {landDivisions.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5 text-farmlink-green" />
                      <div>
                        <p className="text-sm text-farmlink-darkgreen/70">
                          Total Cultivated
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
                  isLoading={landDivisionLoading}
                />
              </div>

              <div className="lg:col-span-2">
                <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-farmlink-green/5 to-farmlink-mediumgreen/5 border-b border-farmlink-lightgreen/20">
                    <CardTitle className="text-farmlink-darkgreen">
                      Land Divisions ({landDivisions.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <LandDivisionList
                      divisions={landDivisions}
                      plants={plants}
                      onEdit={handleEditLandDivision}
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
                <PlantForm
                  onSubmit={handleCreatePlant}
                  isLoading={plantLoading}
                />
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
                    <PlantList
                      plants={plants}
                      onDelete={handleDeletePlant}
                      onEdit={handleEditPlant}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default LandManagement;
