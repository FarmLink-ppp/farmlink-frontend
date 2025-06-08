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
  status: string;
  priority: string;
  start_date: string;
  due_date: string;
  land_division?: {
    name: string;
  };
}

export interface DailyTip {
  id: number;
  title: string;
  content: string;
  category: string;
  created_at: string;
}

export interface WeatherResponse {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}
