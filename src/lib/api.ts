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
  WeatherData,
  WeatherResponse,
  User,
  FollowResponse,
  Follow,
  DailyTip,
  UpcomingTaskResponse,
  UpdateProfileInformationDto,
  UpdatePasswordDto,
  UpdateAccountType,
  AssignTaskDto,
  CreateTaskDto,
  Task,
  TaskAssignment,
  UpdateTaskStatusDto,
  PostResponse,
  PostComment,
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

  async getPlantCount(): Promise<number> {
    return this.request<number>("/plants/count");
  }

  async getCommunityPostCount(): Promise<number> {
    return this.request<number>("/posts/count");
  }

  async getDailyTip(): Promise<DailyTip> {
    return this.request<DailyTip>("/daily-tip");
  }

  async getWeather(fallbackLocation?: string): Promise<WeatherData> {
    const user = await this.getProfileInfo();
    if (!user.location) {
      user.location = fallbackLocation || "Tunis";
    }
    const response = await this.request<WeatherResponse>(
      `/weather?q=${encodeURIComponent(user.location)}`
    );
    return {
      location: user.location,
      temperature: response.main.temp,
      condition: response.weather[0].main,
      humidity: response.main.humidity,
      windSpeed: response.wind.speed,
      high: response.main.temp_max,
      low: response.main.temp_min,
    };
  }

  async getProfileInfo(): Promise<User> {
    return this.request<User>("/users/profile");
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

  async updateWorker(
    id: number,
    data: {
      name?: string;
      contact?: string;
      imageUrl?: string;
      employmentStatus?: "ACTIVE" | "INACTIVE";
    }
  ): Promise<Worker> {
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

  async uploadWorkerImage(
    workerId: number,
    file: File
  ): Promise<{ imageUrl: string }> {
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

  async followUser(userId: number): Promise<FollowResponse> {
    return this.request<FollowResponse>(`/follow/${userId}`, {
      method: "POST",
    });
  }

  async unfollowUser(userId: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/follow/${userId}`, {
      method: "DELETE",
    });
  }

  async getFollowers(): Promise<Follow[]> {
    return this.request<Follow[]>(`/follow/followers`);
  }

  async getFollowing(): Promise<Follow[]> {
    return this.request<Follow[]>(`/follow/following`);
  }

  async getFollowRequests(): Promise<Follow[]> {
    return this.request<Follow[]>(`/follow/requests`);
  }

  async acceptFollowRequest(requestId: number): Promise<FollowResponse> {
    return this.request<FollowResponse>(
      `/follow/requests/${requestId}/accept`,
      {
        method: "POST",
      }
    );
  }

  async rejectFollowRequest(requestId: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(
      `/follow/requests/${requestId}/reject`,
      {
        method: "POST",
      }
    );
  }

  async createTask(data: CreateTaskDto): Promise<Task> {
    console.log("Payload sent to API:", data);
    return this.request<Task>("/tasks", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async assignWorkerToTask(
    taskId: number,
    data: AssignTaskDto
  ): Promise<TaskAssignment> {
    console.log("Payload sent to API:", data);
    return this.request<TaskAssignment>(`/tasks/${taskId}/assign`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getTasksForUser(): Promise<Task[]> {
    return this.request<Task[]>("/tasks");
  }

  async getUpcomingTasks(): Promise<UpcomingTaskResponse> {
    return this.request<UpcomingTaskResponse>("/tasks/upcoming");
  }

  async updateTaskStatus(
    taskId: number,
    data: UpdateTaskStatusDto
  ): Promise<Task> {
    return this.request<Task>(`/tasks/${taskId}/status`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteTask(taskId: number): Promise<MessageResponse> {
    return this.request<MessageResponse>(`/tasks/${taskId}`, {
      method: "DELETE",
    });
  }

  async updateProfileInformation(
    updateProfileInformation: UpdateProfileInformationDto,
    file: File | null = null
  ): Promise<User> {
    const formData = new FormData();
    if (file) {
      formData.append("profileImage", file);
    }

    if (updateProfileInformation.username !== undefined)
      formData.append("username", updateProfileInformation.username);
    if (updateProfileInformation.bio !== undefined)
      formData.append("bio", updateProfileInformation.bio);
    if (updateProfileInformation.location !== undefined)
      formData.append("location", updateProfileInformation.location);
    if (updateProfileInformation.email !== undefined)
      formData.append("email", updateProfileInformation.email);
    if (updateProfileInformation.fullName !== undefined)
      formData.append("fullName", updateProfileInformation.fullName);
    const url = `${API_BASE_URL}/users/profile`;
    const config: RequestInit = {
      method: "PATCH",
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

  async updatePassword(
    updatePasswordDto: UpdatePasswordDto
  ): Promise<MessageResponse> {
    return this.request<MessageResponse>("/users/password", {
      method: "PATCH",
      body: JSON.stringify(updatePasswordDto),
    });
  }

  async updateAccountType(updateAccountType: UpdateAccountType): Promise<User> {
    return this.request<User>("/users/account", {
      method: "PATCH",
      body: JSON.stringify(updateAccountType),
    });
  }

  async deleteAccount(): Promise<MessageResponse> {
    return this.request<MessageResponse>("/users/account", {
      method: "DELETE",
    });
  }

  async createPost(postData: {
    title?: string;
    content?: string;
    image_urls?: File[]; // Accept File objects
    category?: string;
    user_id?: number;
  }): Promise<PostResponse> {
    const formData = new FormData();
    if (postData.title) formData.append("title", postData.title);
    if (postData.content) formData.append("content", postData.content);
    if (postData.category) formData.append("category", postData.category);
    if (postData.image_urls && postData.image_urls.length > 0) {
      postData.image_urls.forEach((file) => {
        formData.append("image_urls", file); // field name must match backend
      });
    }
    // Don't set Content-Type; browser will set it with boundary
    return this.request<PostResponse>("/posts", {
      method: "POST",
      body: formData,
      headers: {
        ...(this.getTokenFromCookie() && {
          Authorization: `Bearer ${this.getTokenFromCookie()}`,
        }),
      },
    });
  }

  async likePost(postId: number): Promise<MessageResponse> {
    console.log(postId);
    return this.request<MessageResponse>(`/posts/like/${postId}`, {
      method: "POST",
    });
  }

  async unlikePost(postId: number): Promise<MessageResponse> {
    return this.request<MessageResponse>(`/posts/like/${postId}`, {
      method: "DELETE",
    });
  }

  async getFeed(): Promise<PostResponse[]> {
    return this.request<PostResponse[]>(`/posts/feed`);
  }

  async getPostComments(postId: number): Promise<PostComment[]> {
    return this.request<PostComment[]>(`/posts/comments/${postId}`);
  }

  async createComment(postId: number, content: string): Promise<PostComment> {
    return this.request<PostComment>(`/posts/comment/${postId}`, {
      method: "POST",
      body: JSON.stringify({ content }),
    });
  }

  async sharePost(postId: number): Promise<MessageResponse> {
    return this.request<MessageResponse>(`/posts/share/${postId}`, {
      method: "POST",
    });
  }

  async getUserPosts(): Promise<PostResponse[]> {
    return this.request<PostResponse[]>(`/posts/me`, {
      method: "GET",
    });
  }

  async getUserSharedPosts(): Promise<PostResponse[]> {
    return this.request<PostResponse[]>(`/posts/me/shared-posts`, {
      method: "GET",
    });
  }
}

export const apiClient = new ApiClient();
