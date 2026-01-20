export interface Conversation {
  id: number;
  members: number[];
  isGroup: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateConversationDto {
  senderId: number;
  receiverId: number;
}

export interface CreateGroupChatDto {
  members: number[];
}

export interface AddUserToGroupDto {
  conversationId: number;
  userId: number;
}
