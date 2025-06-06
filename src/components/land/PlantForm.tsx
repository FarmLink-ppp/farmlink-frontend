
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";

export interface CreatePlantDto {
  name: string;
  description?: string;
  image_url?: string;
}

interface PlantFormProps {
  onSubmit: (data: CreatePlantDto) => void;
  isLoading?: boolean;
}

const PlantForm: React.FC<PlantFormProps> = ({ onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState<CreatePlantDto>({
    name: '',
    description: '',
    image_url: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      description: formData.description || undefined,
      image_url: formData.image_url || undefined
    });
    setFormData({
      name: '',
      description: '',
      image_url: ''
    });
  };

  return (
    <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg">
      <CardHeader className="bg-gradient-to-r from-farmlink-green/5 to-farmlink-mediumgreen/5 border-b border-farmlink-lightgreen/20">
        <CardTitle className="text-farmlink-darkgreen flex items-center">
          <Plus className="mr-2 h-5 w-5" />
          Add Plant
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-farmlink-darkgreen">Plant Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Tomato, Corn, Wheat"
              required
              className="border-farmlink-lightgreen/30 focus:border-farmlink-green"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-farmlink-darkgreen">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the plant..."
              className="border-farmlink-lightgreen/30 focus:border-farmlink-green"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url" className="text-farmlink-darkgreen">Image URL (Optional)</Label>
            <Input
              id="image_url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="https://example.com/plant-image.jpg"
              className="border-farmlink-lightgreen/30 focus:border-farmlink-green"
            />
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-farmlink-green to-farmlink-mediumgreen hover:from-farmlink-mediumgreen hover:to-farmlink-darkgreen text-white"
          >
            {isLoading ? 'Adding...' : 'Add Plant'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PlantForm;