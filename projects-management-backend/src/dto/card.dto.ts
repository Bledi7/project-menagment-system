import { z } from "zod";

/**
 * Create card DTO
 */
export const createCardDtoSchema = z.object({
  sprintId: z.number().int().positive(),
  title: z.string().min(2).max(255),
  description: z.string().optional(),
  status: z.enum(["todo", "in_progress", "done"]).optional(),
  assignedTo: z.number().int().positive().optional(),
});

export type CreateCardDto = z.infer<typeof createCardDtoSchema>;

/**
 * Update card DTO
 */
export const updateCardDtoSchema = z.object({
  sprintId: z.number().int().positive().optional(),
  title: z.string().min(2).max(255).optional(),
  description: z.string().optional().nullable(),
  status: z.enum(["todo", "in_progress", "done"]).optional(),
  assignedTo: z.number().int().positive().optional().nullable(),
});

export type UpdateCardDto = z.infer<typeof updateCardDtoSchema>;
