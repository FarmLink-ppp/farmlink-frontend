
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import WorkerCard from "@/components/workers/WorkerCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Plus, UserPlus, Phone, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface Worker {
  id: number;
  name: string;
  image_url?: string;
  contact: string;
  employment_status: "ACTIVE" | "INACTIVE";
  created_at: string;
  updated_at: string;
  employerId: number;
  // Legacy fields for display compatibility
  imageUrl?: string;
  email: string;
  phone: string;
  position: string;
  hireDate: string;
  status: "active" | "inactive";
  address: string;
}

const Workers = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [workers, setWorkers] = useState<Worker[]>([
    {
      id: 1,
      name: "John Smith",
      image_url: undefined,
      contact: "+1 (555) 123-4567",
      employment_status: "ACTIVE",
      created_at: "2023-01-15T00:00:00Z",
      updated_at: "2023-01-15T00:00:00Z",
      employerId: 1,
      imageUrl: undefined,
      email: "john.smith@farm.com",
      phone: "+1 (555) 123-4567",
      position: "Field Supervisor",
      hireDate: "2023-01-15",
      status: "active",
      address: "123 Farm Road, Rural County"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      image_url: undefined,
      contact: "+1 (555) 234-5678",
      employment_status: "ACTIVE",
      created_at: "2023-03-22T00:00:00Z",
      updated_at: "2023-03-22T00:00:00Z",
      employerId: 1,
      imageUrl: undefined,
      email: "sarah.johnson@farm.com",
      phone: "+1 (555) 234-5678",
      position: "Greenhouse Manager",
      hireDate: "2023-03-22",
      status: "active",
      address: "456 Garden Lane, Rural County"
    },
    {
      id: 3,
      name: "Mike Wilson",
      image_url: undefined,
      contact: "+1 (555) 345-6789",
      employment_status: "INACTIVE",
      created_at: "2022-11-10T00:00:00Z",
      updated_at: "2022-11-10T00:00:00Z",
      employerId: 1,
      imageUrl: undefined,
      email: "mike.wilson@farm.com",
      phone: "+1 (555) 345-6789",
      position: "Equipment Operator",
      hireDate: "2022-11-10",
      status: "inactive",
      address: "789 Tractor Drive, Rural County"
    }
  ]);

  const [newWorker, setNewWorker] = useState({
    name: "",
    imageFile: null as File | null,
    contact: "",
    employment_status: "ACTIVE" as "ACTIVE" | "INACTIVE"
  });

  const { toast } = useToast();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewWorker({...newWorker, imageFile: file});
    }
  };

  const handleCreateWorker = () => {
    if (!newWorker.name || !newWorker.contact) {
      toast({
        title: "Error",
        description: "Please fill in all required fields (name and contact).",
        variant: "destructive",
      });
      return;
    }

    if (newWorker.name.length < 3 || newWorker.name.length > 100) {
      toast({
        title: "Error",
        description: "Name must be between 3 and 100 characters.",
        variant: "destructive",
      });
      return;
    }

    // Create image URL from file if provided
    let imageUrl: string | undefined;
    if (newWorker.imageFile) {
      imageUrl = URL.createObjectURL(newWorker.imageFile);
    }

    const now = new Date().toISOString();
    const worker: Worker = {
      id: Date.now(),
      name: newWorker.name,
      image_url: imageUrl,
      contact: newWorker.contact,
      employment_status: newWorker.employment_status,
      created_at: now,
      updated_at: now,
      employerId: 1, // Default employer ID
      imageUrl: imageUrl,
      email: newWorker.contact.includes('@') ? newWorker.contact : `${newWorker.name.toLowerCase().replace(' ', '.')}@farm.com`,
      phone: newWorker.contact,
      position: "Farm Worker",
      hireDate: new Date().toISOString().split('T')[0],
      status: newWorker.employment_status === "ACTIVE" ? "active" : "inactive",
      address: ""
    };

    setWorkers([...workers, worker]);
    setNewWorker({
      name: "",
      imageFile: null,
      contact: "",
      employment_status: "ACTIVE"
    });
    setIsDialogOpen(false);

    toast({
      title: "Worker Added",
      description: `${worker.name} has been added to your team.`,
    });
  };

  const handleUpdateWorkerStatus = (workerId: number, newStatus: "ACTIVE" | "INACTIVE") => {
    setWorkers(workers.map(worker => 
      worker.id === workerId ? { 
        ...worker, 
        employment_status: newStatus,
        status: newStatus === "ACTIVE" ? "active" : "inactive",
        updated_at: new Date().toISOString()
      } : worker
    ));

    const worker = workers.find(w => w.id === workerId);
    toast({
      title: "Worker Updated",
      description: `${worker?.name}'s employment status changed to ${newStatus.toLowerCase()}.`,
    });
  };

  const activeWorkers = workers.filter(w => w.employment_status === "ACTIVE");
  const inactiveWorkers = workers.filter(w => w.employment_status === "INACTIVE");

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-farmlink-green/10 to-farmlink-mediumgreen/10 rounded-2xl p-8 border border-farmlink-lightgreen/20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-farmlink-darkgreen flex items-center mb-2">
                <Users className="mr-3 h-8 w-8 text-farmlink-green" />
                Workers Management
              </h1>
              <p className="text-farmlink-darkgreen/70 text-lg">
                Manage your farm workers and track their information
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-farmlink-green to-farmlink-mediumgreen hover:from-farmlink-mediumgreen hover:to-farmlink-darkgreen text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
                  <Plus className="mr-2 h-5 w-5" />
                  Add New Worker
                </Button>
              </DialogTrigger>
              <DialogContent className="border-0 bg-white/95 backdrop-blur-sm max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-farmlink-darkgreen text-xl">Add New Worker</DialogTitle>
                  <DialogDescription className="text-farmlink-darkgreen/70">
                    Enter the details for the new farm worker.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="worker-name" className="text-farmlink-darkgreen font-medium">Name *</Label>
                    <Input 
                      id="worker-name" 
                      placeholder="Enter worker's full name (3-100 characters)"
                      value={newWorker.name}
                      onChange={(e) => setNewWorker({...newWorker, name: e.target.value})}
                      className="border-farmlink-lightgreen/30 focus:border-farmlink-green"
                      minLength={3}
                      maxLength={100}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="worker-image" className="text-farmlink-darkgreen font-medium">Profile Image</Label>
                    <Input 
                      id="worker-image" 
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="border-farmlink-lightgreen/30 focus:border-farmlink-green"
                    />
                    {newWorker.imageFile && (
                      <p className="text-sm text-farmlink-darkgreen/70">
                        Selected: {newWorker.imageFile.name}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="worker-contact" className="text-farmlink-darkgreen font-medium">Contact *</Label>
                    <Input 
                      id="worker-contact" 
                      placeholder="Phone number (e.g., +1234567890)"
                      value={newWorker.contact}
                      onChange={(e) => setNewWorker({...newWorker, contact: e.target.value})}
                      className="border-farmlink-lightgreen/30 focus:border-farmlink-green"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="worker-employment-status" className="text-farmlink-darkgreen font-medium">Employment Status</Label>
                    <Select
                      value={newWorker.employment_status}
                      onValueChange={(value: "ACTIVE" | "INACTIVE") => setNewWorker({...newWorker, employment_status: value})}
                    >
                      <SelectTrigger id="worker-employment-status" className="border-farmlink-lightgreen/30 focus:border-farmlink-green">
                        <SelectValue placeholder="Select employment status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-farmlink-lightgreen text-farmlink-darkgreen hover:bg-farmlink-offwhite">
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateWorker} 
                    className="bg-gradient-to-r from-farmlink-green to-farmlink-mediumgreen hover:from-farmlink-mediumgreen hover:to-farmlink-darkgreen text-white"
                  >
                    Add Worker
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-farmlink-darkgreen flex items-center text-sm">
                <Users className="w-4 h-4 mr-2 text-farmlink-green" />
                Total Workers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-farmlink-darkgreen">{workers.length}</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-farmlink-darkgreen flex items-center text-sm">
                <UserPlus className="w-4 h-4 mr-2 text-green-600" />
                Active
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">{activeWorkers.length}</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-farmlink-darkgreen flex items-center text-sm">
                <Mail className="w-4 h-4 mr-2 text-red-600" />
                Inactive
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-600">{inactiveWorkers.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Workers List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-farmlink-darkgreen">Workers</h2>
          
          {workers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workers.map((worker) => (
                <WorkerCard
                  key={worker.id}
                  worker={worker}
                  onStatusChange={(newStatus) => handleUpdateWorkerStatus(worker.id, newStatus)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center p-12 bg-gradient-to-br from-farmlink-offwhite/50 to-white rounded-2xl border border-farmlink-lightgreen/20 shadow-lg">
              <Users className="h-16 w-16 text-farmlink-green/40 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-farmlink-darkgreen mb-2">No workers found</h3>
              <p className="text-farmlink-darkgreen/70 mb-6">Start by adding your first farm worker.</p>
              <Button 
                onClick={() => setIsDialogOpen(true)}
                className="bg-gradient-to-r from-farmlink-green to-farmlink-mediumgreen hover:from-farmlink-mediumgreen hover:to-farmlink-darkgreen text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Worker
              </Button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Workers;