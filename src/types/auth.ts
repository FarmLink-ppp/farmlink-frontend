export enum AccountType {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
}

export interface User {
  id: number;
  username: string;
  email: string;
  account_type?: AccountType;
  full_name: string;
  profile_image?: string;
  bio?: string;
  location?: string;
  is_verified: boolean;
  verify_token?: string | null;
  verify_token_expires?: string | null;
  reset_pass_token?: string | null;
  reset_pass_token_expires?: string | null;
  created_at: string;
  updated_at: string;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  fullName: string;
  profileImage?: string;
  bio?: string;
  location?: string;
}

export interface EmailVerificationDto {
  token: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  password: string;
}

export interface ResendEmailVerificationDto {
  email: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface TokenResponse {
  accessToken: string;
}

export interface MessageResponse {
  message: string;
}

export interface ProfileResponse {
  id: number;
  username: string;
}
