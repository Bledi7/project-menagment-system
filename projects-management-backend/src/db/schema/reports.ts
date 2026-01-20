import { pgTable, serial, varchar, text, date, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";

// Reports table
export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  userName: varchar("user_name", { length: 255 }),
  userId: integer("user_id").references(() => users.id, { onDelete: "SET NULL" }),
  date: date("date").notNull(),
  report: text("report").notNull(),
  isFavorite: boolean("is_favorite").default(false).notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: { name: "idx_reports_user_id", columns: [table.userId] },
  dateIdx: { name: "idx_reports_date", columns: [table.date] },
  isFavoriteIdx: { name: "idx_reports_is_favorite", columns: [table.isFavorite] },
  isReadIdx: { name: "idx_reports_is_read", columns: [table.isRead] },
}));

// Relations
export const reportsRelations = relations(reports, ({ one }) => ({
  user: one(users, {
    fields: [reports.userId],
    references: [users.id],
    relationName: "reportAuthor",
  }),
}));
