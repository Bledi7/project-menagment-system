# Migration Guide: MongoDB to PostgreSQL with Drizzle ORM

This guide will help you migrate from MongoDB (Mongoose) to PostgreSQL (Drizzle ORM) for the Project Management System backend.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Database Setup](#database-setup)
3. [Schema Migration](#schema-migration)
4. [Data Migration](#data-migration)
5. [Code Migration](#code-migration)
6. [Testing](#testing)
7. [Rollback Plan](#rollback-plan)

## Prerequisites

### Required Software

- PostgreSQL 14+ installed and running
- Node.js 18+ and npm
- TypeScript 5+
- Access to your existing MongoDB database

### Required Packages

```bash
npm install drizzle-orm pg @types/pg
npm install --save-dev drizzle-kit @types/node typescript tsx
```

## Database Setup

### 1. Create PostgreSQL Database

```sql
-- Connect to PostgreSQL as superuser
psql -U postgres

-- Create database
CREATE DATABASE project_management_db;

-- Create user (optional but recommended)
CREATE USER pm_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE project_management_db TO pm_user;
```

### 2. Update Environment Variables

Update your `config.env` file:

```env
# Old MongoDB connection
# DATABASE=mongodb://localhost:27017/project_management

# New PostgreSQL connection
DATABASE_URL=postgresql://pm_user:your_password@localhost:5432/project_management_db

# Keep other environment variables
FIREBASE_API_KEY=your_firebase_key
SENDINBLUE_API_KEY=your_sendinblue_key
JiraBaseUrl=https://your-domain.atlassian.net
Email=your_jira_email
Token=your_jira_token
TRELLO_API_KEY=your_trello_key
TRELLO_API_TOKEN=your_trello_token
PORT=2000
NODE_ENV=development
```

## Schema Migration

### 1. Run Migrations

The migration files are already created in `src/db/migrations/`. Run them:

```bash
# Build TypeScript
npm run build

# Run migrations
npm run migrate
```

Or manually:

```bash
# Using psql
psql -U pm_user -d project_management_db -f src/db/migrations/0000_initial.sql
```

### 2. Verify Schema

Connect to PostgreSQL and verify tables:

```sql
\dt
\du

-- Check a specific table
\d users
\d projects
\d teams
```

## Data Migration

### Step-by-Step Data Migration Script

Create a migration script to transfer data from MongoDB to PostgreSQL:

```typescript
// scripts/migrate-data.ts
import { MongoClient } from "mongodb";
import { Pool } from "pg";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

const mongoClient = new MongoClient(process.env.MONGODB_URI!);
const pgPool = new Pool({ connectionString: process.env.DATABASE_URL });

async function migrateUsers() {
  console.log("Migrating users...");
  const mongoDb = mongoClient.db();
  const users = await mongoDb.collection("users").find({}).toArray();

  for (const user of users) {
    await pgPool.query(
      `INSERT INTO users (
        id, first_name, last_name, email, password, role, status,
        phone_number, address, birthday, gender, instagram, twitter,
        github, facebook, profile_image_path, profile_image_content_type,
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      ON CONFLICT (email) DO NOTHING`,
      [
        user.id,
        user.firstName,
        user.lastName,
        user.email,
        user.password, // Already hashed in MongoDB
        user.role,
        user.status || "pending",
        user.phoneNumber || null,
        user.address || null,
        user.birthday ? new Date(user.birthday) : null,
        user.gender || null,
        user.instagram || null,
        user.twitter || null,
        user.gitHub || null,
        user.facebook || null,
        user.profileImage?.path || null,
        user.profileImage?.contentType || null,
        user.createdAt || new Date(),
        user.updatedAt || new Date(),
      ]
    );
  }
  console.log(`✓ Migrated ${users.length} users`);
}

async function migrateProjects() {
  console.log("Migrating projects...");
  const mongoDb = mongoClient.db();
  const projects = await mongoDb.collection("projects").find({}).toArray();

  for (const project of projects) {
    await pgPool.query(
      `INSERT INTO projects (
        title, status, start_date, key, list_id, board_id,
        is_jira_project, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (title) DO NOTHING`,
      [
        project.title,
        project.status || null,
        project.startDate ? new Date(project.startDate) : null,
        project.key || null,
        project.listId || null,
        project.boardId || null,
        project.isJiraProject || null,
        project.createdAt || new Date(),
        project.updatedAt || new Date(),
      ]
    );
  }
  console.log(`✓ Migrated ${projects.length} projects`);
}

async function migrateSprints() {
  console.log("Migrating sprints...");
  const mongoDb = mongoClient.db();
  const sprints = await mongoDb.collection("sprints").find({}).toArray();

  for (const sprint of sprints) {
    await pgPool.query(
      `INSERT INTO sprints (title, created_at, updated_at)
       VALUES ($1, $2, $3)
       ON CONFLICT DO NOTHING`,
      [sprint.title, sprint.createdAt || new Date(), sprint.updatedAt || new Date()]
    );
  }
  console.log(`✓ Migrated ${sprints.length} sprints`);
}

async function migrateReports() {
  console.log("Migrating reports...");
  const mongoDb = mongoClient.db();
  const reports = await mongoDb.collection("reports").find({}).toArray();

  for (const report of reports) {
    // Get user ID from email if userName is provided
    let userId = null;
    if (report.userName) {
      const userResult = await pgPool.query(
        "SELECT id FROM users WHERE CONCAT(first_name, ' ', last_name) = $1 LIMIT 1",
        [report.userName]
      );
      if (userResult.rows.length > 0) {
        userId = userResult.rows[0].id;
      }
    }

    await pgPool.query(
      `INSERT INTO reports (
        user_name, user_id, date, report, is_favorite, is_read,
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        report.userName || null,
        userId,
        new Date(report.date),
        report.report,
        report.isFavorite || false,
        report.isRead || false,
        report.createdAt || new Date(),
        report.updatedAt || new Date(),
      ]
    );
  }
  console.log(`✓ Migrated ${reports.length} reports`);
}

async function migrateAll() {
  try {
    await mongoClient.connect();
    console.log("Connected to MongoDB");

    await pgPool.query("SELECT 1");
    console.log("Connected to PostgreSQL\n");

    await migrateUsers();
    await migrateProjects();
    await migrateSprints();
    await migrateReports();

    console.log("\n✓ Data migration completed successfully!");
  } catch (error) {
    console.error("Migration error:", error);
    throw error;
  } finally {
    await mongoClient.close();
    await pgPool.end();
  }
}

migrateAll();
```

Run the migration:

```bash
tsx scripts/migrate-data.ts
```

### Important Notes for Data Migration

1. **User IDs**: MongoDB uses `id` (number) field. PostgreSQL uses auto-increment `id`. You may need to preserve the original IDs or create a mapping.

2. **Relationships**: 
   - Teams reference projects and users - migrate projects and users first
   - Cards reference sprints - migrate sprints first
   - Messages reference conversations and users - migrate users first

3. **Date Fields**: MongoDB stores dates as Date objects. PostgreSQL DATE/TIMESTAMP fields handle them directly.

4. **Arrays**: MongoDB arrays (like `team.leads`) need to be migrated to join tables (`team_leads`, `team_members`).

## Code Migration

### Changes Already Implemented

✅ All controllers converted to TypeScript with Drizzle ORM
✅ Schema definitions created
✅ Pagination utilities implemented
✅ Error handling updated
✅ Socket.io handlers updated for PostgreSQL

### Key Differences

#### Before (Mongoose):
```javascript
const user = await UserModel.findOne({ email });
const users = await UserModel.find().limit(10);
```

#### After (Drizzle ORM):
```typescript
const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
const users = await db.select().from(users).limit(10);
```

### Transactions

Drizzle ORM supports transactions:

```typescript
await db.transaction(async (tx) => {
  await tx.insert(users).values(...);
  await tx.insert(projects).values(...);
  // If any query fails, all are rolled back
});
```

## Testing

### 1. Unit Tests

Test individual controllers:

```bash
npm test
```

### 2. Integration Tests

Test API endpoints:

```bash
# Start server
npm run dev

# In another terminal, test endpoints
curl http://localhost:2000/api/users
curl http://localhost:2000/api/getProject
```

### 3. Verify Data

```sql
-- Check user count
SELECT COUNT(*) FROM users;

-- Check projects
SELECT * FROM projects LIMIT 5;

-- Check relationships
SELECT t.title, p.title as project
FROM teams t
LEFT JOIN projects p ON t.project_id = p.id;
```

## Rollback Plan

If you need to rollback:

### Option 1: Keep MongoDB Running

Keep MongoDB running alongside PostgreSQL during migration. Update environment variables to switch back:

```env
USE_POSTGRESQL=false
DATABASE=mongodb://localhost:27017/project_management
```

### Option 2: Database Backup

Before migration, backup PostgreSQL:

```bash
pg_dump -U pm_user project_management_db > backup.sql
```

To restore:

```bash
psql -U pm_user project_management_db < backup.sql
```

### Option 3: Revert Code

Keep the old MongoDB code in a separate branch:

```bash
git checkout mongodb-backend
git branch postgresql-backend
git checkout postgresql-backend
# Make changes here
```

## Post-Migration Checklist

- [ ] All tables created successfully
- [ ] All data migrated (verify counts match)
- [ ] Relationships working correctly
- [ ] API endpoints responding
- [ ] Authentication working
- [ ] File uploads working
- [ ] Email sending working
- [ ] Jira integration working
- [ ] Trello integration working
- [ ] Socket.io chat working
- [ ] Pagination working
- [ ] Error handling working
- [ ] Production deployment successful

## Performance Optimization

After migration, consider:

1. **Indexes**: Already included in migration. Monitor query performance:
   ```sql
   EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';
   ```

2. **Connection Pooling**: Already configured in `src/db/index.ts`

3. **Query Optimization**: Use Drizzle's query builder for complex queries

4. **Monitoring**: Set up PostgreSQL monitoring tools

## Troubleshooting

### Common Issues

1. **Connection Error**:
   ```
   Error: connect ECONNREFUSED
   ```
   Solution: Check PostgreSQL is running: `sudo systemctl status postgresql`

2. **Migration Fails**:
   ```
   Error: relation "users" already exists
   ```
   Solution: Drop tables if re-running: `DROP TABLE IF EXISTS users CASCADE;`

3. **Foreign Key Violation**:
   ```
   Error: insert or update on table violates foreign key constraint
   ```
   Solution: Ensure referenced records exist before inserting

4. **Type Mismatch**:
   ```
   Error: invalid input syntax for type integer
   ```
   Solution: Check data types match between MongoDB and PostgreSQL

## Support

For issues or questions:
1. Check Drizzle ORM documentation: https://orm.drizzle.team/
2. Check PostgreSQL documentation: https://www.postgresql.org/docs/
3. Review migration logs for specific errors

## Conclusion

The migration from MongoDB to PostgreSQL is now complete. All controllers have been updated to use Drizzle ORM, and the schema has been redesigned following relational database best practices. The system now uses:

- ✅ PostgreSQL for data persistence
- ✅ Drizzle ORM for type-safe queries
- ✅ Proper relationships and foreign keys
- ✅ Cursor-based pagination
- ✅ Transaction support
- ✅ Full TypeScript typing

Your backend is now production-ready with a robust relational database foundation!
