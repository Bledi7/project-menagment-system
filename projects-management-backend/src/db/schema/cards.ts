import { pgTable, serial, varchar, integer, timestamp, text, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { sprints } from "./sprints";
import { users } from "./users";

// Card status enum
export const cardStatusEnum = pgEnum("card_status", ["todo", "in_progress", "done"]);

// Cards table
export const cards = pgTable("cards", {
  id: serial("id").primaryKey(),
  sprintId: integer("sprint_id").notNull().references(() => sprints.id, { onDelete: "CASCADE" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: cardStatusEnum("status").default("todo").notNull(),
  assignedTo: integer("assigned_to").references(() => users.id, { onDelete: "SET NULL" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  titleIdx: { name: "idx_cards_title", columns: [table.title] },
  sprintIdx: { name: "idx_cards_sprint_id", columns: [table.sprintId] },
  statusIdx: { name: "idx_cards_status", columns: [table.status] },
  assignedToIdx: { name: "idx_cards_assigned_to", columns: [table.assignedTo] },
}));

// Relations
export const cardsRelations = relations(cards, ({ one }) => ({
  sprint: one(sprints, {
    fields: [cards.sprintId],
    references: [sprints.id],
    relationName: "sprintCards",
  }),
  assignedUser: one(users, {
    fields: [cards.assignedTo],
    references: [users.id],
    relationName: "assignedCards",
  }),
}));
