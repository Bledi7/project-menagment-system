import { pgTable, serial, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { projects } from "./projects";

// Teams table
export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  projectId: integer("project_id").references(() => projects.id, { onDelete: "CASCADE" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  projectIdx: { name: "idx_teams_project_id", columns: [table.projectId] },
}));

// Team Leads (Many-to-Many: Teams ↔ Users as Leads)
export const teamLeads = pgTable("team_leads", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").notNull().references(() => teams.id, { onDelete: "CASCADE" }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "CASCADE" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  teamUserIdx: { name: "idx_team_leads_team_user", columns: [table.teamId, table.userId] },
  teamIdx: { name: "idx_team_leads_team_id", columns: [table.teamId] },
  userIdx: { name: "idx_team_leads_user_id", columns: [table.userId] },
}));

// Team Members (Many-to-Many: Teams ↔ Users as Employees)
export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").notNull().references(() => teams.id, { onDelete: "CASCADE" }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "CASCADE" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  teamUserIdx: { name: "idx_team_members_team_user", columns: [table.teamId, table.userId] },
  teamIdx: { name: "idx_team_members_team_id", columns: [table.teamId] },
  userIdx: { name: "idx_team_members_user_id", columns: [table.userId] },
}));

// Relations
export const teamsRelations = relations(teams, ({ one, many }) => ({
  project: one(projects, {
    fields: [teams.projectId],
    references: [projects.id],
    relationName: "projectTeams",
  }),
  leads: many(teamLeads, { relationName: "teamLead" }),
  members: many(teamMembers, { relationName: "teamMember" }),
}));

export const teamLeadsRelations = relations(teamLeads, ({ one }) => ({
  team: one(teams, {
    fields: [teamLeads.teamId],
    references: [teams.id],
    relationName: "teamLead",
  }),
  user: one(users, {
    fields: [teamLeads.userId],
    references: [users.id],
    relationName: "teamLead",
  }),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  team: one(teams, {
    fields: [teamMembers.teamId],
    references: [teams.id],
    relationName: "teamMember",
  }),
  user: one(users, {
    fields: [teamMembers.userId],
    references: [users.id],
    relationName: "teamMember",
  }),
}));
