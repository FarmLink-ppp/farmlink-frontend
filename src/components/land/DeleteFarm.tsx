import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Trash2,
  AlertTriangle,
  Check,
  X,
  MapPin,
  Calendar,
  BarChart3,
} from "lucide-react";
import { useState } from "react";
import { FarmResponse } from "@/types";

interface DeleteFarmProps {
  farm: FarmResponse;
  onDeleteFarm: () => Promise<void>;
  isLoading?: boolean;
}

const DeleteFarm = ({
  farm,
  onDeleteFarm,
  isLoading = false,
}: DeleteFarmProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<
    "confirm" | "verify" | "deleting" | "success"
  >("confirm");
  const [confirmationText, setConfirmationText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const requiredText = `DELETE ${farm.name.toUpperCase()}`;

  const resetDialog = () => {
    setCurrentStep("confirm");
    setConfirmationText("");
    setError(null);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setTimeout(resetDialog, 200);
    }
  };

  const handleInitialConfirm = () => {
    setCurrentStep("verify");
  };

  const handleFinalDelete = async () => {
    if (confirmationText !== requiredText) {
      setError(
        "Confirmation text doesn't match. Please type exactly as shown."
      );
      return;
    }

    setError(null);
    setCurrentStep("deleting");

    try {
      await onDeleteFarm();
      setCurrentStep("success");

      setTimeout(() => {
        setIsOpen(false);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete farm");
      setCurrentStep("verify");
    }
  };

  const isConfirmationValid = confirmationText === requiredText;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          disabled={isLoading}
          className="border-red-200 text-red-600 hover:!bg-red-50 hover:!border-red-300 transition-all duration-200"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Farm
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[625px] bg-white border-red-100">
        {/* Confirmation Step */}
        {currentStep === "confirm" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-red-600 flex items-center text-xl">
                <AlertTriangle className="mr-3 h-6 w-6 text-red-500" />
                Delete Farm
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Farm Preview Card */}
              <div className="bg-gradient-to-r from-red-50 to-red-100/50 rounded-xl p-6 border border-red-200">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Trash2 className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-red-900 text-lg truncate">
                      {farm.name}
                    </h3>
                    <div className="mt-2 space-y-1 text-sm text-red-700">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{farm.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <BarChart3 className="w-4 h-4 flex-shrink-0" />
                        <span>
                          {farm.total_area} {farm.area_unit.toLowerCase()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span>
                          Created{" "}
                          {new Date(farm.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Warning Message */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <p className="font-medium mb-1">
                      This action cannot be undone!
                    </p>
                    <p>Deleting this farm will permanently remove:</p>
                    <ul className="mt-2 space-y-1 list-disc list-inside ml-2">
                      <li>All farm information and settings</li>
                      <li>All land divisions and their data</li>
                      <li>All plants and cultivation records</li>
                      <li>All associated files and history</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  onClick={handleInitialConfirm}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Continue to Delete
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Verification Step */}
        {currentStep === "verify" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-red-600 flex items-center text-xl">
                <AlertTriangle className="mr-3 h-6 w-6 text-red-500" />
                Confirm Deletion
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="text-center">
                <div className="text-gray-700 mb-4">
                  To confirm deletion, please type the following text exactly:
                </div>
                <div className="bg-gray-100 rounded-lg p-4 mb-4">
                  <code className="text-lg font-mono font-bold text-red-600">
                    {requiredText}
                  </code>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2 text-red-700">
                    <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label
                  htmlFor="confirmation"
                  className="text-gray-700 font-medium"
                >
                  Type the confirmation text:
                </Label>
                <Input
                  id="confirmation"
                  type="text"
                  placeholder={`Type "${requiredText}" to confirm`}
                  value={confirmationText}
                  onChange={(e) => {
                    setConfirmationText(e.target.value);
                    setError(null);
                  }}
                  className={`font-mono ${
                    confirmationText && !isConfirmationValid
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                      : isConfirmationValid
                      ? "border-green-300 focus:border-green-500 focus:ring-green-200"
                      : "border-gray-300 focus:border-red-500 focus:ring-red-200"
                  }`}
                  autoComplete="off"
                  spellCheck="false"
                />
                {confirmationText && (
                  <div className="flex items-center space-x-2 text-sm">
                    {isConfirmationValid ? (
                      <>
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-green-600">
                          Confirmation text matches
                        </span>
                      </>
                    ) : (
                      <>
                        <X className="h-4 w-4 text-red-500" />
                        <span className="text-red-600">
                          Confirmation text doesn't match
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep("confirm")}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Back
                </Button>
                <Button
                  onClick={handleFinalDelete}
                  disabled={!isConfirmationValid}
                  className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Farm Forever
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Deleting Step */}
        {currentStep === "deleting" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-red-600 flex items-center text-xl">
                <div className="mr-3 h-6 w-6 border-2 border-red-200 border-t-red-600 rounded-full animate-spin" />
                Deleting Farm
              </DialogTitle>
            </DialogHeader>

            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 border-4 border-red-100 border-t-red-600 rounded-full animate-spin mx-auto" />
                <div className="space-y-2">
                  <p className="text-lg font-medium text-gray-900">
                    Deleting {farm.name}...
                  </p>
                  <p className="text-sm text-gray-600">
                    This may take a few moments
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Success Step */}
        {currentStep === "success" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-green-600 flex items-center text-xl">
                <Check className="mr-3 h-6 w-6 text-green-500" />
                Farm Deleted Successfully
              </DialogTitle>
            </DialogHeader>

            <div className="flex items-center justify-center py-8">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                  <Check className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-medium text-gray-900">
                    {farm.name} has been deleted
                  </p>
                  <p className="text-sm text-gray-600">
                    All farm data has been permanently removed
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DeleteFarm;
