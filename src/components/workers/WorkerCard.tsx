// Updated WorkerCard.tsx — added deletion and edit modal
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Mail, Phone, MapPin, Calendar, Trash2, Pencil } from "lucide-react";
import { FarmerWorker } from "@/pages/Workers";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface WorkerCardProps {
  worker: FarmerWorker;
  onStatusChange: (status: "ACTIVE" | "INACTIVE") => void;
  onDelete: () => void;
  onUpdate: (updatedWorker: Partial<FarmerWorker>) => void;
}

const WorkerCard: React.FC<WorkerCardProps> = ({ worker, onStatusChange, onDelete, onUpdate }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState({ name: worker.name, contact: worker.contact });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 border-green-200";
      case "INACTIVE":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleEditSubmit = () => {
    onUpdate({ ...editData });
    setEditOpen(false);
  };

  return (
    <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-farmlink-green to-farmlink-mediumgreen rounded-full flex items-center justify-center overflow-hidden">
              {worker.imageUrl ? (
                <img 
                  src={worker.imageUrl} 
                  alt={worker.name}
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
              ) : (
                <User className="h-6 w-6 text-white" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-farmlink-darkgreen text-lg">{worker.name}</h3>
              <p className="text-farmlink-darkgreen/70 text-sm">{worker.position}</p>
            </div>
          </div>
          <Badge className={`${getStatusColor(worker.employment_status)} capitalize`}>
            {worker.employment_status.toLowerCase()}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center text-sm text-farmlink-darkgreen/80">
            <Mail className="h-4 w-4 mr-2 text-farmlink-green" />
            <span className="truncate">{worker.email}</span>
          </div>

          <div className="flex items-center text-sm text-farmlink-darkgreen/80">
            <Phone className="h-4 w-4 mr-2 text-farmlink-green" />
            <span>{worker.contact}</span>
          </div>

          <div className="flex items-center text-sm text-farmlink-darkgreen/80">
            <Calendar className="h-4 w-4 mr-2 text-farmlink-green" />
            <span>Created: {new Date(worker.created_at).toLocaleDateString()}</span>
          </div>

          {worker.address && (
            <div className="flex items-start text-sm text-farmlink-darkgreen/80">
              <MapPin className="h-4 w-4 mr-2 text-farmlink-green mt-0.5 flex-shrink-0" />
              <span className="text-xs leading-relaxed">{worker.address}</span>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-farmlink-lightgreen/20 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-farmlink-darkgreen">Employment Status</label>
            <Select
              value={worker.employment_status}
              onValueChange={(value: "ACTIVE" | "INACTIVE") => onStatusChange(value)}
            >
              <SelectTrigger className="border-farmlink-lightgreen/30 focus:border-farmlink-green">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="text-farmlink-green border-farmlink-mediumgreen w-full">
                  <Pencil className="mr-2 h-4 w-4" /> Edit
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Worker</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  />
                  <Label htmlFor="edit-contact">Contact</Label>
                  <Input
                    id="edit-contact"
                    value={editData.contact}
                    onChange={(e) => setEditData({ ...editData, contact: e.target.value })}
                  />
                </div>
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setEditOpen(false)}>Cancel</Button>
                  <Button className="bg-farmlink-green text-white" onClick={handleEditSubmit}>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="text-red-600 border-red-200 w-full">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Worker</DialogTitle>
                </DialogHeader>
                <p>Are you sure you want to delete <strong>{worker.name}</strong>?</p>
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setConfirmOpen(false)}>Cancel</Button>
                  <Button className="bg-red-600 text-white" onClick={onDelete}>Delete</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkerCard;