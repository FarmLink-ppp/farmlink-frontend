
import { useState, useEffect } from 'react';

export interface Worker {
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
  department: string;
  hireDate: string;
  status: "active" | "inactive";
  address: string;
}

// Mock data for workers - this would typically come from an API
const mockWorkers: Worker[] = [
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
    department: "Crop Management",
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
    department: "Greenhouse Operations",
    hireDate: "2023-03-22",
    status: "active",
    address: "456 Garden Lane, Rural County"
  },
  {
    id: 3,
    name: "Mike Wilson",
    image_url: undefined,
    contact: "+1 (555) 345-6789",
    employment_status: "ACTIVE",
    created_at: "2022-11-10T00:00:00Z",
    updated_at: "2022-11-10T00:00:00Z",
    employerId: 1,
    imageUrl: undefined,
    email: "mike.wilson@farm.com",
    phone: "+1 (555) 345-6789",
    position: "Equipment Operator",
    department: "Maintenance",
    hireDate: "2022-11-10",
    status: "active",
    address: "789 Tractor Drive, Rural County"
  },
  {
    id: 4,
    name: "Emma Davis",
    image_url: undefined,
    contact: "+1 (555) 456-7890",
    employment_status: "ACTIVE",
    created_at: "2023-04-01T00:00:00Z",
    updated_at: "2023-04-01T00:00:00Z",
    employerId: 1,
    imageUrl: undefined,
    email: "emma.davis@farm.com",
    phone: "+1 (555) 456-7890",
    position: "Farm Worker",
    department: "General",
    hireDate: "2023-04-01",
    status: "active",
    address: "321 Field Avenue, Rural County"
  }
];

export const useWorkers = () => {
  const [workers] = useState<Worker[]>(mockWorkers);
  
  // Filter to only return active workers for task assignment
  const activeWorkers = workers.filter(worker => worker.employment_status === "ACTIVE");
  
  return {
    workers: activeWorkers,
    isLoading: false,
    error: null
  };
};