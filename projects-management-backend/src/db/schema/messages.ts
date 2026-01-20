import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { conversations } from "./conversations";

// Messages table
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => conversations.id, { onDelete: "CASCADE" }),
  senderId: integer("sender_id").notNull().references(() => users.id, { onDelete: "CASCADE" }),
  text: text("text").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  conversationIdx: { name: "idx_messages_conversation_id", columns: [table.conversationId] },
  senderIdx: { name: "idx_messages_sender_id", columns: [table.senderId] },
  createdAtIdx: { name: "idx_messages_created_at", columns: [table.createdAt] },
}));

// Relations
export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
    relationName: "conversationMessages",
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: "sender",
  }),
}));
