import { pgTable, serial, varchar, date, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Projects table
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull().unique(),
  status: varchar("status", { length: 50 }),
  startDate: date("start_date"),
  key: varchar("key", { length: 50 }), // Jira/Trello project key
  listId: varchar("list_id", { length: 255 }), // Trello list ID
  boardId: varchar("board_id", { length: 255 }), // Trello board ID
  isJiraProject: varchar("is_jira_project", { length: 10 }), // "true" or "false"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  keyIdx: { name: "idx_projects_key", columns: [table.key] },
  statusIdx: { name: "idx_projects_status", columns: [table.status] },
}));

// Relations
export const projectsRelations = relations(projects, ({ many }) => ({
  teams: many(teams, { relationName: "projectTeams" }),
}));

// Import for relations
import { teams } from "./teams";
