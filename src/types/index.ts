export * from "./land";
export * from "./auth";
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
