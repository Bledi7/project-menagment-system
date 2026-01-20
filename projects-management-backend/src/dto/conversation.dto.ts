import { z } from "zod";

/**
 * Create conversation DTO (1-on-1)
 */
export const createConversationDtoSchema = z.object({
  senderId: z.number().int().positive(),
  receiverId: z.number().int().positive(),
});

export type CreateConversationDto = z.infer<typeof createConversationDtoSchema>;

/**
 * Create group chat DTO
 */
export const createGroupChatDtoSchema = z.object({
  members: z.array(z.number().int().positive()).min(2),
});

export type CreateGroupChatDto = z.infer<typeof createGroupChatDtoSchema>;

/**
 * Add user to group DTO
 */
export const addUserToGroupDtoSchema = z.object({
  conversationId: z.number().int().positive(),
  userId: z.number().int().positive(),
});

export type AddUserToGroupDto = z.infer<typeof addUserToGroupDtoSchema>;
