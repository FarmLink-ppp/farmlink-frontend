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

import { Edit } from "lucide-react";
import { useLandDivision } from "@/hooks/useLandDivisions";
import { PlantResponse, UpdatePlantDto } from "@/types";
import { toast } from "@/hooks/use-toast";

interface EditPlantProps {
  plant: PlantResponse;
  onEdit?: (id: number, data: UpdatePlantDto) => void;
}

const EditPlant = ({ plant, onEdit }: EditPlantProps) => {
  const { isLoading } = useLandDivision();
  const [open, setOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<UpdatePlantDto>({
    name: plant.name,
    description: plant.description,
    imageUrl: plant.image_url,
  });

  useEffect(() => {
    if (open) {
      setEditFormData({
        name: plant.name,
        description: plant.description,
        imageUrl: plant.image_url,
      });
    }
  }, [plant, open]);

  const handleEditFormChange =
    (field: keyof UpdatePlantDto) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEditFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleEditSave = () => {
    if (onEdit && plant?.id) {
      onEdit(plant.id, editFormData);
      setTimeout(() => {
        toast({
          title: "Land division updated",
          description: `Changes to "${plant.name}" have been saved successfully.`,
          variant: "default",
        });
        setOpen(false);
      }, 1500);
    }
  };

  const handleDialogClose = () => {
    setEditFormData({
      name: plant.name,
      description: plant.description,
      imageUrl: plant.image_url,
    });
  };

  const hasChanges = () => {
    return (
      editFormData.name !== plant.name ||
      editFormData.description !== plant.description ||
      editFormData.imageUrl !== plant.image_url
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
            Edit Plant
          </DialogTitle>
          <DialogDescription>
            Make changes to your plant
            <strong className="text-farmlink-darkgreen">
              {" "}
              "{plant?.name}"
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
              value={editFormData.name}
              onChange={handleEditFormChange("name")}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="description"
              className="text-right text-farmlink-darkgreen"
            >
              Area
            </Label>
            <Input
              id="description"
              value={editFormData.description}
              onChange={handleEditFormChange("description")}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="imageUrl"
              className="text-right text-farmlink-darkgreen"
            >
              Location
            </Label>
            <Input
              id="imageUrl"
              value={editFormData.imageUrl}
              onChange={handleEditFormChange("imageUrl")}
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

export default EditPlant;
