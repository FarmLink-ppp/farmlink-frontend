import { AccountType } from "./auth";

export interface UpdateProfileInformationDto {
  username?: string;
  email?: string;
  fullName?: string;
  bio?: string;
  location?: string;
}

export interface UpdatePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateAccountType {
  accountType?: AccountType;
}
