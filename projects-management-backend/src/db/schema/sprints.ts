import { pgTable, serial, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { projects } from "./projects";

// Sprints table
export const sprints = pgTable("sprints", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  projectId: integer("project_id").references(() => projects.id, { onDelete: "CASCADE" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  titleIdx: { name: "idx_sprints_title", columns: [table.title] },
  projectIdx: { name: "idx_sprints_project_id", columns: [table.projectId] },
}));

// Relations
export const sprintsRelations = relations(sprints, ({ one, many }) => ({
  project: one(projects, {
    fields: [sprints.projectId],
    references: [projects.id],
    relationName: "projectSprints",
  }),
  cards: many(cards, { relationName: "sprintCards" }),
}));

// Import for relations
import { cards } from "./cards";
