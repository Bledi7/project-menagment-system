import { z } from "zod";

/**
 * Create user DTO
 */
export const createUserDtoSchema = z.object({
  firstName: z.string().min(2).max(255),
  lastName: z.string().min(2).max(255),
  email: z.string().email().max(255),
  password: z.string().min(8).max(255),
  role: z.enum(["Admin", "Product Owner", "Scrum Master", "Developer"]),
  status: z.enum(["pending", "approved", "rejected"]).optional(),
  phoneNumber: z.string().max(20).optional(),
  address: z.string().optional(),
  birthday: z.string().date().optional(),
  gender: z.string().max(20).optional(),
});

export type CreateUserDto = z.infer<typeof createUserDtoSchema>;

/**
 * Update user DTO
 */
export const updateUserDtoSchema = z.object({
  firstName: z.string().min(2).max(255).optional(),
  lastName: z.string().min(2).max(255).optional(),
  email: z.string().email().max(255).optional(),
  password: z.string().min(8).max(255).optional(),
  role: z.enum(["Admin", "Product Owner", "Scrum Master", "Developer"]).optional(),
  status: z.enum(["pending", "approved", "rejected"]).optional(),
  phoneNumber: z.string().max(20).optional(),
  address: z.string().optional(),
  birthday: z.string().date().optional(),
  gender: z.string().max(20).optional(),
  instagram: z.string().max(255).optional(),
  twitter: z.string().max(255).optional(),
  gitHub: z.string().max(255).optional(),
  facebook: z.string().max(255).optional(),
});

export type UpdateUserDto = z.infer<typeof updateUserDtoSchema>;

/**
 * Update user profile DTO
 */
export const updateUserProfileDtoSchema = z.object({
  phoneNumber: z.string().max(20).optional(),
  address: z.string().optional(),
  birthday: z.string().date().optional(),
  gender: z.string().max(20).optional(),
  instagram: z.string().max(255).optional(),
  twitter: z.string().max(255).optional(),
  gitHub: z.string().max(255).optional(),
  facebook: z.string().max(255).optional(),
});

export type UpdateUserProfileDto = z.infer<typeof updateUserProfileDtoSchema>;

/**
 * User response
 */
export interface UserResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  phoneNumber: string | null;
  address: string | null;
  birthday: string | null;
  gender: string | null;
  instagram: string | null;
  twitter: string | null;
  gitHub: string | null;
  facebook: string | null;
  profileImagePath: string | null;
  createdAt: Date;
  updatedAt: Date;
}
