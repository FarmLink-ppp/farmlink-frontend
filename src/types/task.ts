import { FarmerWorker } from "@/pages/Workers";

// Enums matching your Prisma schema
export enum TaskStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

// Basic TaskAssignment model
export interface TaskAssignment {
  id: number;
  assigned_at: string; // ISO date string

  task_id: number;
  worker_id: number;
  // Optional nesting (can be expanded later)
  // task?: Task;
   worker?:FarmerWorker;
}

// Basic Task model
export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  start_date: string;       // ISO date
  due_date: string;         // ISO date
  completion_date?: string; // optional ISO date
  cancelled_at?: string;    // optional ISO date
  created_at: string;
  updated_at: string;

  user_id: number;
  land_division_id?: number;

  // Optionally include related entities if needed later
  // user?: User;
  // land_division?: LandDivision;
  assignments: TaskAssignment[];
}

// === DTOs for API interactions ===
export interface CreateTaskDto {
  title: string;
  description: string;
  priority: TaskPriority;
  startDate: string; // NOTE: camelCase from backend
  dueDate: string;
  landDivisionId?: number; // optional field if needed
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  startDate?: string;
  dueDate?: string;
  landDivisionId?: number;
  status?: TaskStatus;
  completionDate?: string;
  cancelledAt?: string;
}

export interface AssignTaskDto {
  workerId: number;
}

export interface UpdateTaskStatusDto {
  status: TaskStatus;
}
