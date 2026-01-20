import { z } from "zod";

/**
 * Create project DTO
 */
export const createProjectDtoSchema = z.object({
  title: z.string().min(2).max(255),
  status: z.string().max(50).optional(),
  startDate: z.string().date().optional(),
  key: z.string().max(50).optional(),
  listId: z.string().max(255).optional(),
  boardId: z.string().max(255).optional(),
  isJiraProject: z.string().max(10).optional(),
});

export type CreateProjectDto = z.infer<typeof createProjectDtoSchema>;

/**
 * Update project DTO
 */
export const updateProjectDtoSchema = z.object({
  title: z.string().min(2).max(255).optional(),
  status: z.string().max(50).optional(),
  startDate: z.string().date().optional(),
  key: z.string().max(50).optional(),
  listId: z.string().max(255).optional(),
  boardId: z.string().max(255).optional(),
  isJiraProject: z.string().max(10).optional(),
});

export type UpdateProjectDto = z.infer<typeof updateProjectDtoSchema>;
