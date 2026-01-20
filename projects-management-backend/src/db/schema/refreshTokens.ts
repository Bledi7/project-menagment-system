import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";

// Refresh tokens table
export const refreshTokens = pgTable("refresh_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "CASCADE" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: { name: "idx_refresh_tokens_user_id", columns: [table.userId] },
  tokenIdx: { name: "idx_refresh_tokens_token", columns: [table.token] },
  expiresAtIdx: { name: "idx_refresh_tokens_expires_at", columns: [table.expiresAt] },
}));

// Relations
export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
  user: one(users, {
    fields: [refreshTokens.userId],
    references: [users.id],
    relationName: "refreshTokens",
  }),
}));
