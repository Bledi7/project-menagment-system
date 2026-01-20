import { z } from "zod";

/**
 * Create report DTO
 */
export const createReportDtoSchema = z.object({
  userName: z.string().max(255).optional(),
  userId: z.number().int().positive().optional(),
  date: z.string().date(),
  report: z.string().min(1),
  isFavorite: z.boolean().optional(),
  isRead: z.boolean().optional(),
});

export type CreateReportDto = z.infer<typeof createReportDtoSchema>;

/**
 * Update report DTO
 */
export const updateReportDtoSchema = z.object({
  userName: z.string().max(255).optional(),
  userId: z.number().int().positive().optional().nullable(),
  date: z.string().date().optional(),
  report: z.string().min(1).optional(),
  isFavorite: z.boolean().optional(),
  isRead: z.boolean().optional(),
});

export type UpdateReportDto = z.infer<typeof updateReportDtoSchema>;
