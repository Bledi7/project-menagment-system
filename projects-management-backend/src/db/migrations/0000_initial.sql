-- Initial migration: Create all tables with proper relationships

-- Create enums
CREATE TYPE "user_role" AS ENUM('Admin', 'Product Owner', 'Scrum Master', 'Developer');
CREATE TYPE "user_status" AS ENUM('pending', 'approved', 'rejected');
CREATE TYPE "card_status" AS ENUM('todo', 'in_progress', 'done');

-- Users table
CREATE TABLE IF NOT EXISTS "users" (
  "id" SERIAL PRIMARY KEY,
  "first_name" VARCHAR(255) NOT NULL,
  "last_name" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) NOT NULL UNIQUE,
  "password" TEXT NOT NULL,
  "role" "user_role" NOT NULL,
  "status" "user_status" NOT NULL DEFAULT 'pending',
  "phone_number" VARCHAR(20),
  "address" TEXT,
  "birthday" DATE,
  "gender" VARCHAR(20),
  "instagram" VARCHAR(255),
  "twitter" VARCHAR(255),
  "github" VARCHAR(255),
  "facebook" VARCHAR(255),
  "profile_image_path" VARCHAR(500),
  "profile_image_content_type" VARCHAR(100),
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS "idx_users_email" ON "users"("email");
CREATE INDEX IF NOT EXISTS "idx_users_role" ON "users"("role");
CREATE INDEX IF NOT EXISTS "idx_users_status" ON "users"("status");

-- Projects table
CREATE TABLE IF NOT EXISTS "projects" (
  "id" SERIAL PRIMARY KEY,
  "title" VARCHAR(255) NOT NULL UNIQUE,
  "status" VARCHAR(50),
  "start_date" DATE,
  "key" VARCHAR(50),
  "list_id" VARCHAR(255),
  "board_id" VARCHAR(255),
  "is_jira_project" VARCHAR(10),
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS "idx_projects_key" ON "projects"("key");
CREATE INDEX IF NOT EXISTS "idx_projects_status" ON "projects"("status");

-- Teams table
CREATE TABLE IF NOT EXISTS "teams" (
  "id" SERIAL PRIMARY KEY,
  "title" VARCHAR(255) NOT NULL,
  "project_id" INTEGER REFERENCES "projects"("id") ON DELETE CASCADE,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS "idx_teams_project_id" ON "teams"("project_id");

-- Team leads (many-to-many)
CREATE TABLE IF NOT EXISTS "team_leads" (
  "id" SERIAL PRIMARY KEY,
  "team_id" INTEGER NOT NULL REFERENCES "teams"("id") ON DELETE CASCADE,
  "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  UNIQUE("team_id", "user_id")
);

CREATE INDEX IF NOT EXISTS "idx_team_leads_team_user" ON "team_leads"("team_id", "user_id");
CREATE INDEX IF NOT EXISTS "idx_team_leads_team_id" ON "team_leads"("team_id");
CREATE INDEX IF NOT EXISTS "idx_team_leads_user_id" ON "team_leads"("user_id");

-- Team members (many-to-many)
CREATE TABLE IF NOT EXISTS "team_members" (
  "id" SERIAL PRIMARY KEY,
  "team_id" INTEGER NOT NULL REFERENCES "teams"("id") ON DELETE CASCADE,
  "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  UNIQUE("team_id", "user_id")
);

CREATE INDEX IF NOT EXISTS "idx_team_members_team_user" ON "team_members"("team_id", "user_id");
CREATE INDEX IF NOT EXISTS "idx_team_members_team_id" ON "team_members"("team_id");
CREATE INDEX IF NOT EXISTS "idx_team_members_user_id" ON "team_members"("user_id");

-- Sprints table
CREATE TABLE IF NOT EXISTS "sprints" (
  "id" SERIAL PRIMARY KEY,
  "title" VARCHAR(255) NOT NULL,
  "project_id" INTEGER REFERENCES "projects"("id") ON DELETE CASCADE,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS "idx_sprints_title" ON "sprints"("title");
CREATE INDEX IF NOT EXISTS "idx_sprints_project_id" ON "sprints"("project_id");

-- Cards table
CREATE TABLE IF NOT EXISTS "cards" (
  "id" SERIAL PRIMARY KEY,
  "sprint_id" INTEGER NOT NULL REFERENCES "sprints"("id") ON DELETE CASCADE,
  "title" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "status" "card_status" DEFAULT 'todo' NOT NULL,
  "assigned_to" INTEGER REFERENCES "users"("id") ON DELETE SET NULL,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS "idx_cards_title" ON "cards"("title");
CREATE INDEX IF NOT EXISTS "idx_cards_sprint_id" ON "cards"("sprint_id");
CREATE INDEX IF NOT EXISTS "idx_cards_status" ON "cards"("status");
CREATE INDEX IF NOT EXISTS "idx_cards_assigned_to" ON "cards"("assigned_to");

-- Reports table
CREATE TABLE IF NOT EXISTS "reports" (
  "id" SERIAL PRIMARY KEY,
  "user_name" VARCHAR(255),
  "user_id" INTEGER REFERENCES "users"("id") ON DELETE SET NULL,
  "date" DATE NOT NULL,
  "report" TEXT NOT NULL,
  "is_favorite" BOOLEAN DEFAULT false NOT NULL,
  "is_read" BOOLEAN DEFAULT false NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS "idx_reports_user_id" ON "reports"("user_id");
CREATE INDEX IF NOT EXISTS "idx_reports_date" ON "reports"("date");
CREATE INDEX IF NOT EXISTS "idx_reports_is_favorite" ON "reports"("is_favorite");
CREATE INDEX IF NOT EXISTS "idx_reports_is_read" ON "reports"("is_read");

-- Conversations table
CREATE TABLE IF NOT EXISTS "conversations" (
  "id" SERIAL PRIMARY KEY,
  "is_group" BOOLEAN DEFAULT false NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS "idx_conversations_is_group" ON "conversations"("is_group");

-- Conversation members (many-to-many)
CREATE TABLE IF NOT EXISTS "conversation_members" (
  "id" SERIAL PRIMARY KEY,
  "conversation_id" INTEGER NOT NULL REFERENCES "conversations"("id") ON DELETE CASCADE,
  "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "joined_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  UNIQUE("conversation_id", "user_id")
);

CREATE INDEX IF NOT EXISTS "idx_conversation_members_conv_user" ON "conversation_members"("conversation_id", "user_id");
CREATE INDEX IF NOT EXISTS "idx_conversation_members_conversation_id" ON "conversation_members"("conversation_id");
CREATE INDEX IF NOT EXISTS "idx_conversation_members_user_id" ON "conversation_members"("user_id");

-- Messages table
CREATE TABLE IF NOT EXISTS "messages" (
  "id" SERIAL PRIMARY KEY,
  "conversation_id" INTEGER NOT NULL REFERENCES "conversations"("id") ON DELETE CASCADE,
  "sender_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "text" TEXT NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS "idx_messages_conversation_id" ON "messages"("conversation_id");
CREATE INDEX IF NOT EXISTS "idx_messages_sender_id" ON "messages"("sender_id");
CREATE INDEX IF NOT EXISTS "idx_messages_created_at" ON "messages"("created_at");

-- Refresh tokens table
CREATE TABLE IF NOT EXISTS "refresh_tokens" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "token" TEXT NOT NULL UNIQUE,
  "expires_at" TIMESTAMP NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS "idx_refresh_tokens_user_id" ON "refresh_tokens"("user_id");
CREATE INDEX IF NOT EXISTS "idx_refresh_tokens_token" ON "refresh_tokens"("token");
CREATE INDEX IF NOT EXISTS "idx_refresh_tokens_expires_at" ON "refresh_tokens"("expires_at");

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON "users"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON "projects"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON "teams"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sprints_updated_at BEFORE UPDATE ON "sprints"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cards_updated_at BEFORE UPDATE ON "cards"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON "reports"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON "conversations"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON "messages"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
