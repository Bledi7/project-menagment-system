import { z } from "zod";

/**
 * Create sprint DTO
 */
export const createSprintDtoSchema = z.object({
  title: z.string().min(2).max(255),
  projectId: z.number().int().positive().optional(),
});

export type CreateSprintDto = z.infer<typeof createSprintDtoSchema>;

/**
 * Update sprint DTO
 */
export const updateSprintDtoSchema = z.object({
  title: z.string().min(2).max(255).optional(),
  projectId: z.number().int().positive().optional().nullable(),
});

export type UpdateSprintDto = z.infer<typeof updateSprintDtoSchema>;
