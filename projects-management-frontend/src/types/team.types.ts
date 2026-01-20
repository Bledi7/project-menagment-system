export interface Team {
  id: number;
  title: string;
  projectId: number | null;
  leadIds: number[];
  memberIds: number[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTeamDto {
  title: string;
  projectId?: number;
  leadIds?: number[];
  memberIds?: number[];
}

export interface UpdateTeamDto {
  title?: string;
  projectId?: number | null;
  leadIds?: number[];
  memberIds?: number[];
}
