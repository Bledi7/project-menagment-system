export type UserRole = 'Admin' | 'Product Owner' | 'Scrum Master' | 'Developer';
export type UserStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  phoneNumber: string | null;
  address: string | null;
  birthday: string | null;
  gender: string | null;
  instagram: string | null;
  twitter: string | null;
  gitHub: string | null;
  facebook: string | null;
  profileImagePath: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  status?: UserStatus;
  phoneNumber?: string;
  address?: string;
  birthday?: string;
  gender?: string;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  status?: UserStatus;
  phoneNumber?: string;
  address?: string;
  birthday?: string;
  gender?: string;
  instagram?: string;
  twitter?: string;
  gitHub?: string;
  facebook?: string;
}

export interface UpdateUserProfileDto {
  phoneNumber?: string;
  address?: string;
  birthday?: string;
  gender?: string;
  instagram?: string;
  twitter?: string;
  gitHub?: string;
  facebook?: string;
}
