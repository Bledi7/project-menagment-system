# Project Management System Backend - TypeScript + JWT

A fully refactored, production-ready Node.js + Express backend with TypeScript, PostgreSQL, Drizzle ORM, and JWT authentication.

## 🚀 Features

- **TypeScript** - Full type safety throughout
- **PostgreSQL** - Robust relational database
- **Drizzle ORM** - Type-safe, lightweight ORM
- **JWT Authentication** - Access tokens (15 min) + Refresh tokens (7 days)
- **Role-Based Authorization** - Admin, Product Owner, Scrum Master, Developer
- **Zod Validation** - Request validation with Zod schemas
- **Socket.io** - Real-time chat with JWT authentication
- **Cursor Pagination** - Efficient pagination for large datasets
- **File Uploads** - Profile image support via Multer
- **Email Notifications** - Sendinblue integration
- **External APIs** - Jira and Trello integrations
- **ESLint + Prettier** - Code quality and formatting

## 📋 Prerequisites

- Node.js 20+
- PostgreSQL 14+
- npm or yarn

## ⚡ Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment

Create `config.env` in the root directory:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/project_management_db

# JWT Secrets (CHANGE IN PRODUCTION!)
JWT_SECRET=your-super-secret-access-token-key-min-32-characters
JWT_REFRESH_SECRET=your-super-secret-refresh-token-key-min-32-characters

# Server
PORT=2000
NODE_ENV=development
FRONTEND_URL=http://127.0.0.1:5173

# Email (Optional)
SENDINBLUE_API_KEY=your_sendinblue_key

# Jira (Optional)
JiraBaseUrl=https://your-domain.atlassian.net
Email=your_jira_email
Token=your_jira_token

# Trello (Optional)
TRELLO_API_KEY=your_trello_key
TRELLO_API_TOKEN=your_trello_token
```

### 3. Create PostgreSQL Database

```bash
createdb project_management_db
# or
psql -U postgres
CREATE DATABASE project_management_db;
```

### 4. Run Migrations

```bash
npm run migrate
```

This creates all tables, indexes, constraints, and triggers.

### 5. Seed Database (Optional)

```bash
npm run seed
```

Creates sample users:
- Admin: `admin@example.com` / `password123`
- Product Owner: `productowner@example.com` / `password123`
- Scrum Master: `scrummaster@example.com` / `password123`
- Developer: `developer@example.com` / `password123`

### 6. Start Server

```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm run build
npm start
```

Server will start on `http://localhost:2000`

## 📁 Project Structure

```
src/
├── controllers/      # Route handlers
│   ├── AuthController.ts      # JWT authentication
│   ├── UserController.ts      # User management
│   ├── ProjectController.ts   # Project management
│   ├── TeamController.ts      # Team management
│   ├── SprintController.ts    # Sprint management
│   ├── CardController.ts      # Card/Task management
│   ├── ReportController.ts    # Report management
│   ├── ConversationController.ts  # Chat conversations
│   ├── MessageController.ts   # Chat messages
│   ├── EmailController.ts     # Email sending
│   ├── JiraApiController.ts   # Jira integration
│   └── TrelloController.ts    # Trello integration
├── db/
│   ├── index.ts               # Database connection
│   ├── schema/                # Drizzle schema definitions
│   │   ├── users.ts
│   │   ├── projects.ts
│   │   ├── teams.ts
│   │   ├── sprints.ts
│   │   ├── cards.ts
│   │   ├── reports.ts
│   │   ├── conversations.ts
│   │   ├── messages.ts
│   │   └── refreshTokens.ts
│   └── migrations/            # SQL migrations
├── middleware/
│   ├── auth.ts                # JWT authentication middleware
│   └── validation.ts          # Request validation middleware
├── dto/                       # Zod validation schemas
│   ├── auth.dto.ts
│   ├── user.dto.ts
│   ├── project.dto.ts
│   ├── team.dto.ts
│   ├── sprint.dto.ts
│   ├── card.dto.ts
│   ├── report.dto.ts
│   ├── conversation.dto.ts
│   └── message.dto.ts
├── socket/
│   └── Chat.ts                # Socket.io chat handler
├── utils/
│   ├── jwt.ts                 # JWT utilities
│   ├── pagination.ts          # Cursor pagination
│   ├── errors.ts              # Custom error classes
│   └── errorHandler.ts        # Error handling middleware
└── index.ts                   # Main server file
```

## 🔐 Authentication

### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "Developer"
}
```

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "random-token-string",
    "user": {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "Developer",
      "status": "approved"
    }
  }
}
```

### Refresh Token

```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "random-token-string"
}
```

### Logout

```http
POST /api/auth/logout
Content-Type: application/json
Authorization: Bearer <access-token>

{
  "refreshToken": "random-token-string"
}
```

### Protected Routes

Add `Authorization: Bearer <access-token>` header to all protected routes.

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user (Protected)

### Users (Protected)
- `GET /api/users` - Get all users (Admin only, paginated)
- `GET /api/users/:userId` - Get user by ID
- `POST /api/users` - Create user (Admin only)
- `PUT /api/users/:userId` - Update user
- `DELETE /api/users/:userId` - Delete user (Admin only)
- `POST /api/users/profile` - Update own profile
- `GET /api/users/:userId/profile-picture` - Get profile picture
- `GET /api/users/random` - Get random users

### Projects (Protected)
- `GET /api/projects` - Get all projects (paginated)
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create project (Product Owner, Admin)
- `PUT /api/projects/:id` - Update project (Product Owner, Admin)
- `DELETE /api/projects/:id` - Delete project (Product Owner, Admin)

### Teams (Protected)
- `GET /api/teams` - Get all teams
- `GET /api/teams/:id` - Get team by ID
- `GET /api/teams/by-project` - Get teams grouped by project
- `POST /api/teams` - Create team (Scrum Master, Product Owner, Admin)
- `PUT /api/teams/:id` - Update team (Scrum Master, Product Owner, Admin)
- `DELETE /api/teams/:id` - Delete team (Scrum Master, Product Owner, Admin)

### Sprints (Protected)
- `GET /api/sprints` - Get all sprints (paginated)
- `GET /api/sprints/:id` - Get sprint by ID
- `POST /api/sprints` - Create sprint (Scrum Master, Product Owner, Admin)
- `PUT /api/sprints/:id` - Update sprint (Scrum Master, Product Owner, Admin)
- `DELETE /api/sprints/:id` - Delete sprint (Scrum Master, Product Owner, Admin)

### Cards (Protected)
- `GET /api/cards` - Get all cards (paginated, filterable by sprintId, status, assignedTo)
- `GET /api/cards/:id` - Get card by ID
- `POST /api/cards` - Create card (Developer, Scrum Master, Product Owner, Admin)
- `PUT /api/cards/:id` - Update card (Developer, Scrum Master, Product Owner, Admin)
- `DELETE /api/cards/:id` - Delete card (Scrum Master, Product Owner, Admin)

### Reports (Protected)
- `GET /api/reports` - Get all reports (paginated, filterable)
- `GET /api/reports/:id` - Get report by ID
- `POST /api/reports` - Create report
- `PUT /api/reports/:id` - Update report (own or Admin)
- `DELETE /api/reports/:id` - Delete report (own or Admin)

### Conversations (Protected)
- `GET /api/conversations` - Get all conversations for current user
- `POST /api/conversations` - Create or get 1-on-1 conversation
- `POST /api/conversations/group` - Create or get group chat
- `POST /api/conversations/group/add-user` - Add user to group chat

### Messages (Protected)
- `GET /api/conversations/:conversationId/messages` - Get messages for conversation (paginated)
- `POST /api/messages` - Create message

### External Integrations (Protected)
- `GET /api/jira/statistics/:projectKey` - Get Jira statistics (Admin, Product Owner, Scrum Master)
- `GET /api/jira/users/:projectKey` - Get Jira project users (Admin, Product Owner, Scrum Master)
- `GET /api/trello/combined-stats/:boardId` - Get Trello combined stats (Admin, Product Owner, Scrum Master)
- `GET /api/trello/cards/:boardId` - Get Trello cards per list (Admin, Product Owner, Scrum Master)
- `GET /api/trello/weekly-stats/:boardId` - Get Trello weekly stats (Admin, Product Owner, Scrum Master)

### Email (Protected)
- `POST /api/emails` - Send single email (Admin, Product Owner, Scrum Master)
- `POST /api/emails/message` - Send message email to multiple receivers (Admin, Product Owner, Scrum Master)

## 📊 Database Schema

### Core Tables

- **users** - User accounts and profiles
- **projects** - Project information
- **teams** - Team definitions
- **team_leads** - Many-to-many: Teams ↔ Users (as leads)
- **team_members** - Many-to-many: Teams ↔ Users (as members)
- **sprints** - Sprint definitions (references projects)
- **cards** - Task cards (references sprints, users)
- **reports** - User reports
- **conversations** - Chat conversations (1-on-1 or group)
- **conversation_members** - Many-to-many: Conversations ↔ Users
- **messages** - Chat messages
- **refresh_tokens** - JWT refresh tokens (references users)

### Relationships

- Projects → Teams (one-to-many)
- Projects → Sprints (one-to-many)
- Teams → Users (many-to-many via join tables)
- Sprints → Cards (one-to-many)
- Users → Cards (one-to-many, via assignedTo)
- Users → Reports (one-to-many)
- Conversations → Users (many-to-many via conversation_members)
- Conversations → Messages (one-to-many)
- Users → RefreshTokens (one-to-many)

## 🔒 Security

- **JWT Access Tokens** - 15 minute expiry
- **JWT Refresh Tokens** - 7 day expiry, stored in PostgreSQL
- **Password Hashing** - bcrypt with 10 rounds
- **Role-Based Authorization** - Middleware for route protection
- **Request Validation** - Zod schemas for all inputs
- **CORS** - Configured for frontend domain
- **File Upload Validation** - Type and size restrictions

## 📝 Pagination

All list endpoints support cursor-based pagination:

```http
GET /api/users?limit=20&cursor=eyJpZCI6MTB9&orderBy=desc&orderByColumn=createdAt
```

Parameters:
- `limit` - Number of results (default: 20, max: 100)
- `cursor` - Base64 encoded cursor
- `orderBy` - "asc" or "desc" (default: "asc")
- `orderByColumn` - Column to order by (default: "id")

## 🎯 Socket.io

### Client Connection

Connect with JWT token:

```javascript
import { io } from "socket.io-client";

const socket = io("http://localhost:2000", {
  auth: {
    token: "your-access-token"
  }
});
```

### Events

**Client → Server:**
- `addUser` - Initialize user connection
- `joinGroup` - Join a group conversation
- `sendMessage` - Send a message
- `leaveGroup` - Leave a group conversation

**Server → Client:**
- `getUsers` - List of online users
- `getMessage` - New message received
- `userJoined` - User joined a group
- `userLeft` - User left a group
- `error` - Error message

## 🛠️ Development

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Formatting
npm run format

# Build
npm run build

# Run migrations
npm run migrate

# Seed database
npm run seed
```

## 📦 Dependencies

### Core
- `express` - Web framework
- `drizzle-orm` - Type-safe ORM
- `pg` - PostgreSQL client
- `jsonwebtoken` - JWT handling
- `bcrypt` - Password hashing
- `zod` - Schema validation
- `socket.io` - Real-time communication

### Development
- `typescript` - TypeScript compiler
- `tsx` - TypeScript execution
- `tsc-alias` - Path alias resolution
- `eslint` - Linting
- `prettier` - Code formatting
- `tsconfig-paths` - Path alias support

## 🔧 Configuration

### Environment Variables

All environment variables should be set in `config.env`:

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for access tokens (min 32 chars)
- `JWT_REFRESH_SECRET` - Secret for refresh tokens (min 32 chars)
- `PORT` - Server port (default: 2000)
- `NODE_ENV` - Environment (development/production)
- `FRONTEND_URL` - Frontend URL for CORS
- `SENDINBLUE_API_KEY` - Email service API key (optional)
- `JiraBaseUrl`, `Email`, `Token` - Jira API credentials (optional)
- `TRELLO_API_KEY`, `TRELLO_API_TOKEN` - Trello API credentials (optional)

## 📚 TypeScript Path Aliases

Path aliases are configured in `tsconfig.json`:

- `@/*` - `src/*`
- `@controllers/*` - `src/controllers/*`
- `@models/*` - `src/models/*`
- `@middleware/*` - `src/middleware/*`
- `@routes/*` - `src/routes/*`
- `@socket/*` - `src/socket/*`
- `@utils/*` - `src/utils/*`
- `@db/*` - `src/db/*`
- `@dto/*` - `src/dto/*`

## 🚀 Production Deployment

1. Set `NODE_ENV=production`
2. Use strong, unique JWT secrets (min 32 characters)
3. Enable SSL for PostgreSQL connection
4. Configure proper CORS origins
5. Set up file upload directory with proper permissions
6. Use process manager (PM2, systemd, etc.)
7. Set up reverse proxy (nginx, Apache)
8. Enable rate limiting
9. Set up monitoring and logging
10. Configure backups for PostgreSQL

## 📖 API Documentation

Full API documentation will be available after starting the server at `/` endpoint.

## 🤝 Contributing

1. Follow TypeScript best practices
2. Use ESLint and Prettier
3. Write typed code with proper DTOs
4. Add validation for all inputs
5. Include error handling
6. Test all endpoints

## 📄 License

[Your License Here]

---

**Built with ❤️ using TypeScript, PostgreSQL, and Drizzle ORM**
