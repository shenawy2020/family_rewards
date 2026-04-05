export interface AuthResponse {
  token: string;
  fullName: string;
  email: string;
  role: 'Admin' | 'Child';
  userId: number;
  familyId: number;
  avatarUrl?: string;
}

export interface RegisterDto {
  familyName: string;
  fullName: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}
