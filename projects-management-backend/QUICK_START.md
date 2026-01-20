# Quick Start Guide

Get your refactored PostgreSQL backend up and running in minutes!

## 🚀 Prerequisites

- Node.js 18+ installed
- PostgreSQL 14+ installed and running
- Firebase Admin SDK credentials (`serviceAccountKey.json`)

## ⚡ Quick Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Create PostgreSQL Database

```bash
# Using psql
psql -U postgres
CREATE DATABASE project_management_db;
\q

# Or using createdb
createdb project_management_db
```

### 3. Configure Environment

Copy the example environment file:

```bash
cp .env.example config.env
```

Edit `config.env` with your credentials:

```env
DATABASE_URL=postgresql://your_username:your_password@localhost:5432/project_management_db
FIREBASE_API_KEY=your_key
SENDINBLUE_API_KEY=your_key
```

### 4. Set Up Firebase

Place your `serviceAccountKey.json` file in the root directory.

### 5. Run Migrations

```bash
npm run migrate
```

This creates all tables, indexes, and constraints.

### 6. Seed Database (Optional)

```bash
npm run seed
```

This creates sample users, projects, teams, etc.

Default credentials:
- Admin: `admin@example.com` / `password123`
- Product Owner: `productowner@example.com` / `password123`
- Scrum Master: `scrummaster@example.com` / `password123`
- Developer: `developer@example.com` / `password123`

### 7. Start Server

```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm run build
npm start
```

Server will start on `http://localhost:2000`

## ✅ Verify Installation

Test the API:

```bash
# Health check
curl http://localhost:2000/health

# Get users
curl http://localhost:2000/api/users

# Get projects
curl http://localhost:2000/api/getProject
```

## 📚 Next Steps

- Read [README_REFACTOR.md](./README_REFACTOR.md) for full documentation
- Check [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) if migrating from MongoDB
- Review API endpoints in the README
- Set up your frontend to connect to the API

## 🐛 Troubleshooting

### Database Connection Error

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Verify connection
psql -U your_username -d project_management_db
```

### Migration Fails

```bash
# Drop all tables if needed (careful!)
psql -U your_username -d project_management_db -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# Then run migrations again
npm run migrate
```

### TypeScript Compilation Errors

```bash
# Clean and rebuild
rm -rf dist node_modules
npm install
npm run build
```

## 🎉 Success!

Your backend is now running with PostgreSQL and Drizzle ORM!

For more details, see:
- [Full Documentation](./README_REFACTOR.md)
- [Migration Guide](./MIGRATION_GUIDE.md)
