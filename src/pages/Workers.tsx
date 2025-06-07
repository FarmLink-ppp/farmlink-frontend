// Updated Workers.tsx with update and delete capabilities
import React, { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import WorkerCard from "@/components/workers/WorkerCard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";

export interface FarmerWorker {
  id: number;
  name: string;
  image_url?: string;
  contact: string;
  employment_status: "ACTIVE" | "INACTIVE";
  created_at: string;
  updated_at: string;
  employerId: number;
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
  const [workers, setWorkers] = useState<FarmerWorker[]>([]);
  const [loading, setLoading] = useState(true);
  const [newWorker, setNewWorker] = useState({
    name: "",
    imageFile: null as File | null,
    contact: "",
    employment_status: "ACTIVE" as "ACTIVE" | "INACTIVE",
  });

  const { toast } = useToast();

  useEffect(() => {
    apiClient.getWorkersByEmployer()
      .then((data) => {
        const mapped = data.map((w: any) => ({
          ...w,
          email: `${w.name.replace(/\s+/g, ".").toLowerCase()}@farm.com`,
          phone: w.contact,
          position: "Farm Worker",
          hireDate: new Date(w.created_at).toISOString().split("T")[0],
          status: w.employment_status === "ACTIVE" ? "active" : "inactive",
          address: "",
          imageUrl: w.image_url,
        }));
        setWorkers(mapped);
      })
      .catch((err) => toast({ title: "Error", description: err.message, variant: "destructive" }))
      .finally(() => setLoading(false));
  }, []);

  const handleCreateWorker = async () => {
    if (!newWorker.name || !newWorker.contact) {
      toast({ title: "Error", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }

    try {
      const created = await apiClient.createWorker({ name: newWorker.name, contact: newWorker.contact }) as unknown as FarmerWorker;
      if (newWorker.imageFile) {
        const res = await apiClient.uploadWorkerImage(created.id, newWorker.imageFile);
        (created as any).image_url = res.imageUrl;
        (created as any).imageUrl = res.imageUrl;
      }
      const enriched: FarmerWorker = {
        ...created,
        email: `${created.name.replace(/\s+/g, ".").toLowerCase()}@farm.com`,
        phone: created.contact,
        position: "Farm Worker",
        hireDate: new Date(created.created_at).toISOString().split("T")[0],
        status: created.employment_status === "ACTIVE" ? "active" : "inactive",
        address: "",
        imageUrl: created.image_url ?? created.imageUrl,
      };
      setWorkers((prev) => [...prev, enriched]);
      setIsDialogOpen(false);
      setNewWorker({ name: "", imageFile: null, contact: "", employment_status: "ACTIVE" });
      toast({ title: "Worker Added", description: `${enriched.name} has been added.` });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleUpdateWorkerStatus = async (workerId: number, newStatus: "ACTIVE" | "INACTIVE") => {
    try {
      await apiClient.updateWorker(workerId, { employmentStatus: newStatus });
      setWorkers((prev) =>
        prev.map((w) =>
          w.id === workerId ? { ...w, employment_status: newStatus, status: newStatus === "ACTIVE" ? "active" : "inactive" } : w
        )
      );
      toast({ title: "Worker Updated", description: `Status changed to ${newStatus}` });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleDeleteWorker = async (workerId: number) => {
    try {
      await apiClient.deleteWorker(workerId);
      setWorkers((prev) => prev.filter((w) => w.id !== workerId));
      toast({ title: "Worker Deleted", description: `Worker has been removed.` });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };
  const handleUpdateWorker = async (id: number, updated: Partial<FarmerWorker>) => {
  try {
    const updatedWorker = await apiClient.updateWorker(id, updated);
    setWorkers((prev) =>
      prev.map((w) => w.id === id ? { ...w, ...updated, name: updated.name ?? w.name, contact: updated.contact ?? w.contact } : w)
    );
    toast({ title: "Worker Updated", description: `${updated.name ?? ""} updated successfully.` });
  } catch (err: any) {
    toast({ title: "Error", description: err.message, variant: "destructive" });
  }
};

  const activeWorkers = workers.filter((w) => w.employment_status === "ACTIVE");
  const inactiveWorkers = workers.filter((w) => w.employment_status === "INACTIVE");

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="bg-gradient-to-r from-farmlink-green/10 to-farmlink-mediumgreen/10 rounded-2xl p-8 border">
          <div className="flex justify-between">
            <h1 className="text-4xl font-bold text-farmlink-darkgreen flex items-center">
              <Users className="mr-3 h-8 w-8 text-farmlink-green" /> Workers Management
            </h1>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-farmlink-green to-farmlink-mediumgreen text-white">
                  <Plus className="mr-2 h-5 w-5" /> Add New Worker
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Worker</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <Label htmlFor="worker-name">Name *</Label>
                  <Input id="worker-name" value={newWorker.name} onChange={(e) => setNewWorker({ ...newWorker, name: e.target.value })} />

                  <Label htmlFor="worker-image">Profile Image</Label>
                  <Input id="worker-image" type="file" accept="image/*" onChange={(e) => setNewWorker({ ...newWorker, imageFile: e.target.files?.[0] || null })} />

                  <Label htmlFor="worker-contact">Contact *</Label>
                  <Input id="worker-contact" value={newWorker.contact} onChange={(e) => setNewWorker({ ...newWorker, contact: e.target.value })} />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreateWorker} className="bg-farmlink-green text-white">Add Worker</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card><CardHeader><CardTitle>Total Workers</CardTitle></CardHeader><CardContent>{workers.length}</CardContent></Card>
          <Card><CardHeader><CardTitle>Active</CardTitle></CardHeader><CardContent>{activeWorkers.length}</CardContent></Card>
          <Card><CardHeader><CardTitle>Inactive</CardTitle></CardHeader><CardContent>{inactiveWorkers.length}</CardContent></Card>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Workers</h2>
          {loading ? <p>Loading...</p> : workers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workers.map((worker: FarmerWorker) => (
               <WorkerCard
  key={worker.id}
  worker={worker}
  onStatusChange={(status) => handleUpdateWorkerStatus(worker.id, status)}
  onDelete={() => handleDeleteWorker(worker.id)}
  onUpdate={(updated) => handleUpdateWorker(worker.id, updated)} // ⬅️ ajoute ceci
/>

              ))}
            </div>
          ) : (
            <p>No workers found.</p>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Workers;
