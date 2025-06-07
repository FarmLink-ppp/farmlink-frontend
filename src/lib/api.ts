import {
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
  CreateFarmDto,
  FarmResponse,
  UpdateFarmDto,
  LandDivisionResponse,
  CreateLandDivisionDto,
  CreatePlantDto,
  PlantResponse,
  UpdateLandDivisionDto,
  UpdatePlantDto,
} from "@/types";

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

  async createFarm(farmData: CreateFarmDto): Promise<FarmResponse> {
    return this.request<FarmResponse>("/farms/create", {
      method: "POST",
      body: JSON.stringify(farmData),
    });
  }

  async getFarm(): Promise<FarmResponse> {
    return this.request<FarmResponse>("/farms");
  }

  async updateFarm(farmData: UpdateFarmDto): Promise<FarmResponse> {
    return this.request<FarmResponse>("/farms/update", {
      method: "PATCH",
      body: JSON.stringify(farmData),
    });
  }

  async deleteFarm(): Promise<FarmResponse> {
    return this.request<FarmResponse>("/farms/delete", {
      method: "DELETE",
    });
  }

  async createLandDivision(
    landDivisionData: CreateLandDivisionDto
  ): Promise<LandDivisionResponse> {
    return this.request<LandDivisionResponse>("/land-divisions/create", {
      method: "POST",
      body: JSON.stringify(landDivisionData),
    });
  }

  async getLandDivisions(): Promise<LandDivisionResponse[]> {
    return this.request<LandDivisionResponse[]>("/land-divisions/farm");
  }

  async getLandDivisionById(
    landDivisionId: number
  ): Promise<LandDivisionResponse> {
    return this.request<LandDivisionResponse>(
      `/land-divisions/${landDivisionId}`
    );
  }

  async updateLandDivision(
    landDivisionId: number,
    landDivisionData: UpdateLandDivisionDto
  ): Promise<LandDivisionResponse> {
    return this.request<LandDivisionResponse>(
      `/land-divisions/${landDivisionId}/update`,
      {
        method: "PATCH",
        body: JSON.stringify(landDivisionData),
      }
    );
  }

  async deleteLandDivision(
    landDivisionId: number
  ): Promise<LandDivisionResponse> {
    return this.request<LandDivisionResponse>(
      `/land-divisions/${landDivisionId}/delete`,
      {
        method: "DELETE",
      }
    );
  }

  async getLandDivisionPlant(
    landDivisionId: number
  ): Promise<LandDivisionResponse> {
    return this.request<LandDivisionResponse>(
      `/land-divisions/${landDivisionId}/plants`
    );
  }

  async createPlant(plantData: CreatePlantDto): Promise<PlantResponse> {
    return this.request<PlantResponse>("/plants/create", {
      method: "POST",
      body: JSON.stringify(plantData),
    });
  }

  async getAllPlants(): Promise<PlantResponse[]> {
    return this.request<PlantResponse[]>("/plants");
  }

  async getPlantById(plantId: number): Promise<PlantResponse> {
    return this.request<PlantResponse>(`/plants/${plantId}`);
  }

  async updatePlant(
    plantId: number,
    plantData: UpdatePlantDto
  ): Promise<PlantResponse> {
    return this.request<PlantResponse>(`/plants/${plantId}/update`, {
      method: "PATCH",
      body: JSON.stringify(plantData),
    });
  }

  async deletePlant(plantId: number): Promise<PlantResponse> {
    return this.request<PlantResponse>(`/plants/${plantId}/delete`, {
      method: "DELETE",
    });
  }
// WORKERS
async getWorkersByEmployer(): Promise<Worker[]> {
  return this.request<Worker[]>("/worker/employer");
}

async getWorkersByStatus(status: "ACTIVE" | "INACTIVE"): Promise<Worker[]> {
  return this.request<Worker[]>(`/worker?status=${status}`);
}

async createWorker(data: {
  name: string;
  contact: string;
  imageUrl?: string;
}): Promise<Worker> {
  return this.request<Worker>("/worker", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

async updateWorker(id: number, data: {
  name?: string;
  contact?: string;
  imageUrl?: string;
  employmentStatus?: "ACTIVE" | "INACTIVE";
}): Promise<Worker> {
  return this.request<Worker>(`/worker/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

async deleteWorker(id: number): Promise<{ message: string }> {
  return this.request<{ message: string }>(`/worker/${id}`, {
    method: "DELETE",
  });
}

async uploadWorkerImage(workerId: number, file: File): Promise<{ imageUrl: string }> {
  const formData = new FormData();
  formData.append("profileImage", file);

  const url = `${API_BASE_URL}/worker/${workerId}/profile-image`;
  const config: RequestInit = {
    method: "POST",
    headers: this.getAuthHeadersForFormData(),
    credentials: "include",
    body: formData,
  };

  const response = await fetch(url, config);
  if (!response.ok) {
    throw new Error(`Image upload failed. Status: ${response.status}`);
  }
  return response.json();
}

  
}

export const apiClient = new ApiClient();
