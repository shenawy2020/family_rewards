export interface AuthResponse {
  token: string;
  fullName: string;
  email: string;
  role: 'Admin' | 'Child';
  userId: number;
  familyId: number;
  familyCode: string;
  loginCode?: string;
  avatarUrl?: string;
  themeColor?: string;
  language?: string;
}

export interface RegisterDto {
  familyName: string;
  fullName: string;
  email: string;
  password: string;
}

export interface LoginDto {
  loginId: string;
  password: string;
}
