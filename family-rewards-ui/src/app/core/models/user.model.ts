export interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
  avatarUrl?: string;
  familyId: number;
  starBalance: number;
}

export interface AddChildDto {
  fullName: string;
  email: string;
  password: string;
  avatarUrl?: string;
}
