
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, MapPin } from "lucide-react";
import { CultivationStatus, CreateLandDivisionDto, Plant } from '@/types/land';
import { toast } from 'sonner';
import { title } from 'process';

interface LandDivisionFormProps {
  onSubmit: (data: CreateLandDivisionDto) => void;
  plants: Plant[];
  isLoading?: boolean;
}

const LandDivisionForm: React.FC<LandDivisionFormProps> = ({ onSubmit, plants, isLoading = false }) => {
  const [formData, setFormData] = useState<CreateLandDivisionDto>({
    name: '',
    area: 0,
    cultivationStatus: CultivationStatus.FALLOW,
    geolocation: '',
    plantId: undefined
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: '',
      area: 0,
      cultivationStatus: CultivationStatus.FALLOW,
      geolocation: '',
      plantId: undefined
    });
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData({
            ...formData,
            geolocation: `${latitude},${longitude}`
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        // Add user feedback
        toast.error("Location Error", {
          description: "Failed to access your location. Please check permissions or enter coordinates manually.",
        });
        }
      );
    }
  };

  return (
    <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg">
      <CardHeader className="bg-gradient-to-r from-farmlink-green/5 to-farmlink-mediumgreen/5 border-b border-farmlink-lightgreen/20">
        <CardTitle className="text-farmlink-darkgreen flex items-center">
          <Plus className="mr-2 h-5 w-5" />
          Add Land Division
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-farmlink-darkgreen">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., North Plot"
              required
              className="border-farmlink-lightgreen/30 focus:border-farmlink-green"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="area" className="text-farmlink-darkgreen">Area (hectares)</Label>
            <Input
              id="area"
              type="number"
              step="0.1"
              min="0"
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: parseFloat(e.target.value) || 0 })}
              placeholder="1.5"
              required
              className="border-farmlink-lightgreen/30 focus:border-farmlink-green"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-farmlink-darkgreen">Cultivation Status</Label>
            <Select
              value={formData.cultivationStatus}
              onValueChange={(value: CultivationStatus) => 
                setFormData({ ...formData, cultivationStatus: value })
              }
            >
              <SelectTrigger className="border-farmlink-lightgreen/30 focus:border-farmlink-green">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={CultivationStatus.PLANTED}>Planted</SelectItem>
                <SelectItem value={CultivationStatus.HARVESTED}>Harvested</SelectItem>
                <SelectItem value={CultivationStatus.FALLOW}>Fallow</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-farmlink-darkgreen">Plant (Optional)</Label>
            <Select
              value={formData.plantId?.toString() || "none"}
              onValueChange={(value) => 
                setFormData({ ...formData, plantId: value === "none" ? undefined : parseInt(value) })
              }
            >
              <SelectTrigger className="border-farmlink-lightgreen/30 focus:border-farmlink-green">
                <SelectValue placeholder="Select a plant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No plant assigned</SelectItem>
                {plants.map((plant) => (
                  <SelectItem key={plant.id} value={plant.id.toString()}>
                    {plant.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="geolocation" className="text-farmlink-darkgreen">GPS Coordinates</Label>
            <div className="flex gap-2">
              <Input
                id="geolocation"
                value={formData.geolocation}
                onChange={(e) => setFormData({ ...formData, geolocation: e.target.value })}
                placeholder="35.6895,139.6917"
                required
                className="border-farmlink-lightgreen/30 focus:border-farmlink-green"
              />
              <Button
                type="button"
                variant="outline"
                onClick={getCurrentLocation}
                className="border-farmlink-lightgreen/30 text-farmlink-darkgreen hover:bg-farmlink-green/5"
              >
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-farmlink-green to-farmlink-mediumgreen hover:from-farmlink-mediumgreen hover:to-farmlink-darkgreen text-white"
          >
            {isLoading ? 'Adding...' : 'Add Land Division'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LandDivisionForm;