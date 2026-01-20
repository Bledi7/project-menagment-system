import { z } from "zod";

/**
 * Register DTO
 */
export const registerDtoSchema = z.object({
  firstName: z.string().min(2).max(255),
  lastName: z.string().min(2).max(255),
  email: z.string().email().max(255),
  password: z.string().min(8).max(255),
  role: z.enum(["Admin", "Product Owner", "Scrum Master", "Developer"]),
  phoneNumber: z.string().max(20).optional(),
  address: z.string().optional(),
  birthday: z.string().date().optional(),
  gender: z.string().max(20).optional(),
});

export type RegisterDto = z.infer<typeof registerDtoSchema>;

/**
 * Login DTO
 */
export const loginDtoSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type LoginDto = z.infer<typeof loginDtoSchema>;

/**
 * Refresh token DTO
 */
export const refreshTokenDtoSchema = z.object({
  refreshToken: z.string().min(1),
});

export type RefreshTokenDto = z.infer<typeof refreshTokenDtoSchema>;

/**
 * Auth response
 */
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    status: string;
  };
}
