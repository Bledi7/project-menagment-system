export interface Project {
  id: number;
  title: string;
  status: string | null;
  startDate: string | null;
  key: string | null;
  listId: string | null;
  boardId: string | null;
  isJiraProject: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectDto {
  title: string;
  status?: string;
  startDate?: string;
  key?: string;
  listId?: string;
  boardId?: string;
  isJiraProject?: string;
}

export interface UpdateProjectDto {
  title?: string;
  status?: string;
  startDate?: string;
  key?: string;
  listId?: string;
  boardId?: string;
  isJiraProject?: string;
}
