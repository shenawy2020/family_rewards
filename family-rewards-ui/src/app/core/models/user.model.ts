export interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
  avatarUrl?: string;
  familyId: number;
  starBalance: number;
  loginCode?: string;
  childSequence?: number;
}

export interface AddChildDto {
  fullName: string;
  password: string;
  avatarUrl?: string;
}

export interface UpdateChildDto {
  fullName: string;
  avatarUrl?: string;
}

export interface ResetPasswordDto {
  newPassword: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}
