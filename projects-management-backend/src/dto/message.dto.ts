import { z } from "zod";

/**
 * Create message DTO
 */
export const createMessageDtoSchema = z.object({
  conversationId: z.number().int().positive(),
  senderId: z.number().int().positive(),
  text: z.string().min(1),
});

export type CreateMessageDto = z.infer<typeof createMessageDtoSchema>;
