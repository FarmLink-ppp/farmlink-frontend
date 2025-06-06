
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Trash2, Edit, Sprout } from "lucide-react";
import { LandDivision, CultivationStatus } from '@/types/land';

interface LandDivisionListProps {
  divisions: LandDivision[];
  onEdit?: (division: LandDivision) => void;
  onDelete?: (id: number) => void;
}

const LandDivisionList: React.FC<LandDivisionListProps> = ({ 
  divisions, 
  onEdit, 
  onDelete 
}) => {
  const getStatusColor = (status: CultivationStatus) => {
    switch (status) {
      case CultivationStatus.PLANTED:
        return "bg-green-100 text-green-800 border-green-200";
      case CultivationStatus.HARVESTED:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case CultivationStatus.FALLOW:
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: CultivationStatus) => {
    switch (status) {
      case CultivationStatus.PLANTED:
        return <Sprout className="h-4 w-4" />;
      case CultivationStatus.HARVESTED:
        return <span className="text-sm">🌾</span>;
      case CultivationStatus.FALLOW:
        return <span className="text-sm">🌱</span>;
      default:
        return null;
    }
  };

  if (divisions.length === 0) {
    return (
      <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg">
        <CardContent className="p-6 text-center">
          <p className="text-farmlink-darkgreen/70">No land divisions created yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {divisions.map((division) => (
        <Card key={division.id} className="border-0 bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-farmlink-darkgreen text-lg">{division.name}</CardTitle>
              <Badge className={`${getStatusColor(division.cultivation_status)} capitalize flex items-center gap-1`}>
                {getStatusIcon(division.cultivation_status)}
                {division.cultivation_status.toLowerCase()}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-farmlink-darkgreen/70">Area:</span>
                <span className="ml-2 font-medium text-farmlink-darkgreen">{division.area} hectares</span>
              </div>
              <div>
                <span className="text-farmlink-darkgreen/70">Plant:</span>
                <span className="ml-2 font-medium text-farmlink-darkgreen">
                  {division.plant?.name || 'No plant assigned'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center text-sm text-farmlink-darkgreen/80">
              <MapPin className="h-4 w-4 mr-2 text-farmlink-green" />
              <span className="font-mono text-xs">{division.geolocation}</span>
            </div>
            
            <div className="text-xs text-farmlink-darkgreen/70">
              Created: {new Date(division.created_at).toLocaleDateString()}
            </div>
            
            {(onEdit || onDelete) && (
              <div className="flex gap-2 pt-2 border-t border-farmlink-lightgreen/20">
                {onEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(division)}
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
                    onClick={() => onDelete(division.id)}
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

export default LandDivisionList;