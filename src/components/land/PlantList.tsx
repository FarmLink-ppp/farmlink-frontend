import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Leaf } from "lucide-react";
import { Plant } from "@/types";

interface PlantListProps {
  plants: Plant[];
  onEdit?: (plant: Plant) => void;
  onDelete?: (id: number) => void;
}

const PlantList: React.FC<PlantListProps> = ({ plants, onEdit, onDelete }) => {
  if (plants.length === 0) {
    return (
      <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg">
        <CardContent className="p-6 text-center">
          <p className="text-farmlink-darkgreen/70">No plants created yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {plants.map((plant) => (
        <Card
          key={plant.id}
          className="border-0 bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-farmlink-darkgreen text-lg flex items-center">
                <Leaf className="h-5 w-5 mr-2 text-farmlink-green" />
                {plant.name}
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            {plant.description && (
              <p className="text-sm text-farmlink-darkgreen/70">
                {plant.description}
              </p>
            )}

            {plant.image_url && (
              <div className="w-full h-32 rounded-lg overflow-hidden bg-farmlink-lightgreen/10">
                <img
                  src={plant.image_url}
                  alt={plant.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              </div>
            )}

            <div className="text-xs text-farmlink-darkgreen/70">
              Created: {new Date(plant.created_at).toLocaleDateString()}
            </div>

            {(onEdit || onDelete) && (
              <div className="flex gap-2 pt-2 border-t border-farmlink-lightgreen/20">
                {onEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(plant)}
                    className="border-farmlink-lightgreen/30 text-farmlink-darkgreen hover:bg-farmlink-green/5"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(plant.id)}
                    className="border-red-300/30 text-red-700 hover:bg-red-500/5"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PlantList;
