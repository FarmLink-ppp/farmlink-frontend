import { FarmerWorker } from "@/pages/Workers";

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

export interface TaskAssignment {
  id: number;
  assigned_at: string;
  task_id: number;
  worker_id: number;
  worker?: FarmerWorker;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  start_date: string;
  due_date: string;
  completion_date?: string | null;
  cancelled_at?: string | null;
  created_at: string;
  updated_at: string;
  user_id: number;
  land_division_id?: number;
  assignments: TaskAssignment[];
}

export interface CreateTaskDto {
  title: string;
  description: string;
  priority: TaskPriority;
  startDate: string;
  dueDate: string;
  landDivisionId?: number | null;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  startDate?: string;
  dueDate?: string;
  landDivisionId?: number;
}

export interface AssignTaskDto {
  workerId: number;
}

export interface UpdateTaskStatusDto {
  status: TaskStatus;
}

export interface UpcomingTaskResponse {
  tasks: Task[];
  totalCount: number;
}
