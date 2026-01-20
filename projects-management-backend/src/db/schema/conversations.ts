import { pgTable, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";

// Conversations table
export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  isGroup: boolean("is_group").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  isGroupIdx: { name: "idx_conversations_is_group", columns: [table.isGroup] },
}));

// Conversation Members (Many-to-Many: Conversations ↔ Users)
export const conversationMembers = pgTable("conversation_members", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => conversations.id, { onDelete: "CASCADE" }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "CASCADE" }),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
}, (table) => ({
  conversationUserIdx: { name: "idx_conversation_members_conv_user", columns: [table.conversationId, table.userId] },
  conversationIdx: { name: "idx_conversation_members_conversation_id", columns: [table.conversationId] },
  userIdx: { name: "idx_conversation_members_user_id", columns: [table.userId] },
}));

// Relations
export const conversationsRelations = relations(conversations, ({ many }) => ({
  members: many(conversationMembers, { relationName: "conversationMembers" }),
  messages: many(messages, { relationName: "conversationMessages" }),
}));

export const conversationMembersRelations = relations(conversationMembers, ({ one }) => ({
  conversation: one(conversations, {
    fields: [conversationMembers.conversationId],
    references: [conversations.id],
    relationName: "conversationMembers",
  }),
  user: one(users, {
    fields: [conversationMembers.userId],
    references: [users.id],
    relationName: "conversationMember",
  }),
}));

// Import for relations
import { messages } from "./messages";
