/**
 * Cursor-based pagination utilities for Drizzle ORM
 */

export interface PaginationParams {
  limit?: number;
  cursor?: string; // Base64 encoded cursor
  orderBy?: "asc" | "desc";
  orderByColumn?: string;
}

export interface PaginationResult<T> {
  data: T[];
  nextCursor: string | null;
  hasMore: boolean;
  total?: number;
}

/**
 * Parse cursor from base64 string
 */
export function parseCursor(cursor?: string): { [key: string]: any } | null {
  if (!cursor) return null;
  try {
    const decoded = Buffer.from(cursor, "base64").toString("utf-8");
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

/**
 * Create cursor from object
 */
export function createCursor(data: { [key: string]: any }): string {
  return Buffer.from(JSON.stringify(data)).toString("base64");
}

/**
 * Default pagination limit
 */
export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;

/**
 * Validate and sanitize pagination parameters
 */
export function sanitizePaginationParams(params: PaginationParams): {
  limit: number;
  cursor: { [key: string]: any } | null;
  orderBy: "asc" | "desc";
  orderByColumn: string;
} {
  const limit = Math.min(
    params.limit && params.limit > 0 ? params.limit : DEFAULT_LIMIT,
    MAX_LIMIT
  );
  const cursor = parseCursor(params.cursor);
  const orderBy = params.orderBy === "desc" ? "desc" : "asc";
  const orderByColumn = params.orderByColumn || "id";

  return { limit, cursor, orderBy, orderByColumn };
}
