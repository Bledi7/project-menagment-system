import { z } from "zod";

/**
 * Create team DTO
 */
export const createTeamDtoSchema = z.object({
  title: z.string().min(2).max(255),
  projectId: z.number().int().positive().optional(),
  leadIds: z.array(z.number().int().positive()).optional(),
  memberIds: z.array(z.number().int().positive()).optional(),
});

export type CreateTeamDto = z.infer<typeof createTeamDtoSchema>;

/**
 * Update team DTO
 */
export const updateTeamDtoSchema = z.object({
  title: z.string().min(2).max(255).optional(),
  projectId: z.number().int().positive().optional().nullable(),
  leadIds: z.array(z.number().int().positive()).optional(),
  memberIds: z.array(z.number().int().positive()).optional(),
});

export type UpdateTeamDto = z.infer<typeof updateTeamDtoSchema>;
