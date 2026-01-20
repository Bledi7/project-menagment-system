export interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMessageDto {
  conversationId: number;
  senderId: number;
  text: string;
}

export interface SocketMessage {
  senderId: number;
  text: string;
  createdAt: number;
}
