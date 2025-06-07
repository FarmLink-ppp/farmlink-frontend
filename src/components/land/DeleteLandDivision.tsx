import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useLandDivision } from "@/hooks/useLandDivisions";
import { LandDivisionResponse } from "@/types";
import { Trash2 } from "lucide-react";
import { useState } from "react";

interface DeleteLandDivisionProps {
  division: LandDivisionResponse;
  onDelete?: (id: number) => void;
}

const DeleteLandDivision = ({
  division,
  onDelete,
}: DeleteLandDivisionProps) => {
  const { isLoading } = useLandDivision();
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    if (onDelete && division?.id) {
      onDelete(division.id);
      setOpen(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-red-300/30 text-red-700 hover:bg-red-500/5"
          disabled={isLoading}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-farmlink-darkgreen">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the land
            division
            <strong className="text-farmlink-darkgreen">
              {" "}
              "{division?.name}"
            </strong>{" "}
            and remove all its data from your farm.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-farmlink-lightgreen/30 text-farmlink-darkgreen hover:bg-farmlink-green/5">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteLandDivision;
