import { pgTable, serial, varchar, text, date, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enum for user roles
export const userRoleEnum = pgEnum("user_role", [
  "Admin",
  "Product Owner",
  "Scrum Master",
  "Developer",
]);

// Enum for user status
export const userStatusEnum = pgEnum("user_status", ["pending", "approved", "rejected"]);

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(), // Hashed password
  role: userRoleEnum("role").notNull(),
  status: userStatusEnum("status").default("pending").notNull(),
  phoneNumber: varchar("phone_number", { length: 20 }),
  address: text("address"),
  birthday: date("birthday"),
  gender: varchar("gender", { length: 20 }),
  instagram: varchar("instagram", { length: 255 }),
  twitter: varchar("twitter", { length: 255 }),
  gitHub: varchar("github", { length: 255 }),
  facebook: varchar("facebook", { length: 255 }),
  profileImagePath: varchar("profile_image_path", { length: 500 }),
  profileImageContentType: varchar("profile_image_content_type", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  emailIdx: { name: "idx_users_email", columns: [table.email] },
  roleIdx: { name: "idx_users_role", columns: [table.role] },
  statusIdx: { name: "idx_users_status", columns: [table.status] },
}));

// Relations will be defined separately to avoid circular dependencies
