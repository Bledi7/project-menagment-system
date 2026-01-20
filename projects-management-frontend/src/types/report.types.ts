export interface Report {
  id: number;
  userName: string | null;
  userId: number | null;
  date: string;
  report: string;
  isFavorite: boolean;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReportDto {
  userName?: string;
  userId?: number;
  date: string;
  report: string;
  isFavorite?: boolean;
  isRead?: boolean;
}

export interface UpdateReportDto {
  userName?: string;
  userId?: number | null;
  date?: string;
  report?: string;
  isFavorite?: boolean;
  isRead?: boolean;
}
