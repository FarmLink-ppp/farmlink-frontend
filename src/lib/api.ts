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
} from "@/types";
import { CreatePostDto, PostResponse } from "@/types/post";

export interface PostComment {
  id: number;
  content: string;
  created_at: string;
  user: {
    id: number;
    username: string;
    account_type: string;
    profile_image?: string;
  };
}

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

      // Handle empty response (204 No Content or content-length 0)
      const contentLength = response.headers.get("content-length");
      if (response.status === 204 || contentLength === "0") {
        // @ts-ignore
        return {};
      }
      // Defensive: also check if response has no body
      const text = await response.text();
      if (!text) {
        // @ts-ignore
        return {};
      }
      return JSON.parse(text);
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

  async createPost(postData: {
    title?: string;
    content?: string;
    image_urls?: string[];
    category?: string;
    user_id?: number;
  }): Promise<PostResponse> {
    return this.request<PostResponse>("/posts", {
      method: "POST",
      body: JSON.stringify(postData),
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
}

export const apiClient = new ApiClient();
