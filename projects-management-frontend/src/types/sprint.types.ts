export interface Sprint {
  id: number;
  title: string;
  projectId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSprintDto {
  title: string;
  projectId?: number;
}

export interface UpdateSprintDto {
  title?: string;
  projectId?: number | null;
}
