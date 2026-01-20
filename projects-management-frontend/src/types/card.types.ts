export type CardStatus = 'todo' | 'in_progress' | 'done';

export interface Card {
  id: number;
  sprintId: number;
  title: string;
  description: string | null;
  status: CardStatus;
  assignedTo: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCardDto {
  sprintId: number;
  title: string;
  description?: string;
  status?: CardStatus;
  assignedTo?: number;
}

export interface UpdateCardDto {
  sprintId?: number;
  title?: string;
  description?: string | null;
  status?: CardStatus;
  assignedTo?: number | null;
}
