/**
 * Common TypeScript types for the application
 */

import { users, userRoleEnum, userStatusEnum } from "../db/schema/users";

// User types
export type UserRole = typeof userRoleEnum.enumValues[number];
export type UserStatus = typeof userStatusEnum.enumValues[number];
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// Common response types
export interface ApiResponse<T> {
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  message?: string;
  data: T[];
  nextCursor: string | null;
  hasMore: boolean;
  total?: number;
}
