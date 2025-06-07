import {
  User,
  LoginDto,
  CreateUserDto,
  EmailVerificationDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ResendEmailVerificationDto,
  LoginResponse,
  RegisterResponse,
  TokenResponse,
  MessageResponse,
  ApiError,
  ProfileResponse,
  ScanWithDiagnosis,
  CreateScanResponse,
  
} from "@/types";
import type { AssignTaskDto, CreateTaskDto, Task, TaskAssignment } from "@/types/task";
const API_BASE_URL = "http://localhost:3000/api";

class ApiClient {
  private getTokenFromCookie(): string | null {
    if (typeof document === "undefined") return null;

    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === "access_token") {
        return decodeURIComponent(value);
      }
    }
    return null;
  }

  private getAuthHeaders(): HeadersInit {
    const token = this.getTokenFromCookie();
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private getAuthHeadersForFormData(): HeadersInit {
    const token = this.getTokenFromCookie();
    return {
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: this.getAuthHeaders(),
      credentials: "include",
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({
          message: `HTTP error! status: ${response.status}`,
          statusCode: response.status,
        }));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  }

  async login(loginData: LoginDto): Promise<LoginResponse> {
    return this.request<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(loginData),
    });
  }

  async register(userData: CreateUserDto): Promise<RegisterResponse> {
    return this.request<RegisterResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async refreshToken(): Promise<TokenResponse> {
    return this.request<TokenResponse>("/auth/refresh", {
      method: "POST",
    });
  }

  async verifyEmail(
    verificationData: EmailVerificationDto
  ): Promise<MessageResponse> {
    return this.request<MessageResponse>("/auth/verify-email", {
      method: "POST",
      body: JSON.stringify(verificationData),
    });
  }

  async resendVerificationEmail(
    emailData: ResendEmailVerificationDto
  ): Promise<MessageResponse> {
    return this.request<MessageResponse>("/auth/resend-verification", {
      method: "POST",
      body: JSON.stringify(emailData),
    });
  }

  async forgotPassword(
    passwordData: ForgotPasswordDto
  ): Promise<MessageResponse> {
    return this.request<MessageResponse>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(passwordData),
    });
  }

  async resetPassword(resetData: ResetPasswordDto): Promise<MessageResponse> {
    return this.request<MessageResponse>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(resetData),
    });
  }

  async getProfile(): Promise<ProfileResponse> {
    return this.request<ProfileResponse>("/auth/profile");
  }

  async logout(): Promise<MessageResponse> {
    return this.request<MessageResponse>("/auth/logout", {
      method: "POST",
    });
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      await this.getProfile();
      return true;
    } catch {
      return false;
    }
  }

  async createPlantHealthScan(file: File): Promise<CreateScanResponse> {
    const formData = new FormData();
    formData.append("plantImage", file);

    const url = `${API_BASE_URL}/plant-health/scan`;
    const config: RequestInit = {
      method: "POST",
      headers: this.getAuthHeadersForFormData(),
      credentials: "include",
      body: formData,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({
          message: `HTTP error! status: ${response.status}`,
          statusCode: response.status,
        }));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  }

  async getAllDiagnosis(): Promise<ScanWithDiagnosis[]> {
    return this.request<ScanWithDiagnosis[]>("/plant-health/diagnosis");
  }
  async createTask(data: CreateTaskDto): Promise<Task> {
    console.log("Payload sent to API:", data);
  return this.request<Task>("/tasks", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
async assignWorkerToTask(taskId: number, data: AssignTaskDto): Promise<TaskAssignment> {
  console.log("Payload sent to API:",data);
  return this.request<TaskAssignment>(`/tasks/${taskId}/assign`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

}



export const apiClient = new ApiClient();
