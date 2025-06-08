export * from "./land";
export * from "./auth";
export * from "./plant-health";
export * from "./farm";
export * from "./follow";
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  statusCode?: number;
}
export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  high: number;
  low: number;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  start_date: string;
  due_date: string;
  land_division_id: number;
}

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
export interface TaskResponse {
  tasks: Task[];
  totalCount: number;
}

export interface DailyTip {
  id: number;
  title: string;
  content: string;
  category: string;
  created_at: string;
}

export interface WeatherResponse {
  coord: Coordinates;
  weather: Weather[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level: number;
    grnd_level: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

interface Coordinates {
  lon: number;
  lat: number;
}

interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}
