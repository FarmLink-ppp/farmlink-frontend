import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit } from "lucide-react";
import { useLandDivision } from "@/hooks/useLandDivisions";
import {
  LandDivisionResponse,
  UpdateLandDivisionDto,
  CultivationStatus,
  PlantResponse,
} from "@/types";
import { toast } from "@/hooks/use-toast";

interface EditLandDivisionProps {
  division: LandDivisionResponse;
  plants?: PlantResponse[];
  onEdit?: (id: number, data: UpdateLandDivisionDto) => void;
}

const EditLandDivision = ({
  division,
  plants = [],
  onEdit,
}: EditLandDivisionProps) => {
  const { isLoading } = useLandDivision();
  const [open, setOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<UpdateLandDivisionDto>({
    name: division.name,
    area: division.area,
    cultivationStatus: division.cultivation_status,
    geolocation: division.geolocation,
    plantId: division.plant_id,
  });

  useEffect(() => {
    if (open) {
      setEditFormData({
        name: division.name,
        area: division.area,
        cultivationStatus: division.cultivation_status,
        geolocation: division.geolocation,
        plantId: division.plant_id,
      });
    }
  }, [division, open]);

  const handleEditFormChange =
    (field: keyof UpdateLandDivisionDto) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value =
        field === "area" ? parseFloat(e.target.value) : e.target.value;
      setEditFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    };
  const handlePlantChange = (value: string) => {
    const plantId = value === "none" ? null : parseInt(value);
    setEditFormData((prev) => ({ ...prev, plantId }));
  };

  const handleCultivationStatusChange = (value: CultivationStatus) => {
    setEditFormData((prev) => ({ ...prev, cultivationStatus: value }));
  };

  const handleEditSave = () => {
    if (onEdit && division?.id) {
      onEdit(division.id, editFormData);
      setTimeout(() => {
        toast({
          title: "Land division updated",
          description: `Changes to "${division.name}" have been saved successfully.`,
          variant: "default",
        });
        setOpen(false);
      }, 1500);
    }
  };

  const handleDialogClose = () => {
    setEditFormData({
      name: division.name,
      area: division.area,
      cultivationStatus: division.cultivation_status,
      geolocation: division.geolocation,
      plantId: division.plant_id,
    });
  };

  const hasChanges = () => {
    return (
      editFormData.name !== division.name ||
      editFormData.area !== division.area ||
      editFormData.cultivationStatus !== division.cultivation_status ||
      editFormData.geolocation !== division.geolocation ||
      editFormData.plantId !== division.plant_id
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-farmlink-lightgreen/30 text-farmlink-darkgreen hover:bg-farmlink-green/5"
          disabled={isLoading}
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-farmlink-darkgreen">
            Edit Land Division
          </DialogTitle>
          <DialogDescription>
            Make changes to your land division
            <strong className="text-farmlink-darkgreen">
              {" "}
              "{division?.name}"
            </strong>
            . Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="name"
              className="text-right text-farmlink-darkgreen"
            >
              Name
            </Label>
            <Input
              id="name"
              value={editFormData.name || ""}
              onChange={handleEditFormChange("name")}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="area"
              className="text-right text-farmlink-darkgreen"
            >
              Area
            </Label>
            <Input
              id="area"
              type="number"
              step="0.01"
              value={editFormData.area || ""}
              onChange={handleEditFormChange("area")}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="status"
              className="text-right text-farmlink-darkgreen"
            >
              Status
            </Label>
            <Select
              value={editFormData.cultivationStatus}
              onValueChange={handleCultivationStatusChange}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={CultivationStatus.PLANTED}>
                  Planted
                </SelectItem>
                <SelectItem value={CultivationStatus.HARVESTED}>
                  Harvested
                </SelectItem>
                <SelectItem value={CultivationStatus.FALLOW}>Fallow</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="plant"
              className="text-right text-farmlink-darkgreen"
            >
              Plant
            </Label>
            <Select
              value={editFormData.plantId?.toString()}
              onValueChange={handlePlantChange}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select plant" />
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="geolocation"
              className="text-right text-farmlink-darkgreen"
            >
              Location
            </Label>
            <Input
              id="geolocation"
              value={editFormData.geolocation || ""}
              onChange={handleEditFormChange("geolocation")}
              className="col-span-3"
              placeholder="e.g., 36.8065, 10.1815"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleDialogClose}
            className="border-farmlink-lightgreen/30 text-farmlink-darkgreen hover:bg-farmlink-green/5"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleEditSave}
            disabled={isLoading || !hasChanges()}
            className="bg-farmlink-green hover:bg-farmlink-darkgreen text-white"
          >
            {isLoading ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditLandDivision;
