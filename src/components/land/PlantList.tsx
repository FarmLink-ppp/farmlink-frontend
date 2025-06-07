import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Leaf, Calendar, Image } from "lucide-react";
import EditPlant from "./EditPlant";
import { PlantResponse, UpdatePlantDto } from "@/types";
import DeletePlant from "./DeletePlant";

interface PlantListProps {
  plants: PlantResponse[];
  onEdit: (id: number, data: UpdatePlantDto) => void;
  onDelete: (id: number) => void;
}

const PlantList: React.FC<PlantListProps> = ({ plants, onEdit, onDelete }) => {
  if (plants.length === 0) {
    return (
      <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg">
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center space-y-3">
            <Leaf className="h-12 w-12 text-farmlink-green/40" />
            <p className="text-farmlink-darkgreen/70 text-lg font-medium">
              No plants in your garden yet
            </p>
            <p className="text-farmlink-darkgreen/50 text-sm">
              Start by adding your first plant to begin tracking your garden
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {plants.map((plant) => (
        <Card
          key={plant.id}
          className="border-0 bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/80"
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-farmlink-darkgreen text-xl flex items-center font-semibold">
                <Leaf className="h-5 w-5 mr-2 text-farmlink-green" />
                {plant.name}
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {plant.description && (
              <p className="text-sm text-farmlink-darkgreen/80 leading-relaxed">
                {plant.description}
              </p>
            )}

            <div className="relative w-full h-40 rounded-lg overflow-hidden bg-farmlink-lightgreen/10 group">
              {plant.image_url ? (
                <img
                  src={plant.image_url}
                  alt={`${plant.name} plant`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    // Show fallback content
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div class="w-full h-full flex flex-col items-center justify-center text-farmlink-green/40">
                          <svg class="h-8 w-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          <span class="text-xs">Image not available</span>
                        </div>
                      `;
                    }
                  }}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-farmlink-green/40">
                  <Image className="h-8 w-8 mb-2" />
                  <span className="text-xs">No image available</span>
                </div>
              )}
            </div>

            <div className="flex items-center text-xs text-farmlink-darkgreen/60 bg-farmlink-lightgreen/10 px-3 py-2 rounded-md">
              <Calendar className="h-3 w-3 mr-2" />
              Added on{" "}
              {new Date(plant.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>

            {(onEdit || onDelete) && (
              <div className="flex gap-2 pt-3 border-t border-farmlink-lightgreen/20">
                {onEdit && <EditPlant plant={plant} onEdit={onEdit} />}
                {onDelete && <DeletePlant plant={plant} onDelete={onDelete} />}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PlantList;
