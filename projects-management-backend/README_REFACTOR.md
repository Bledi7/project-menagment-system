# Project Management System Backend - PostgreSQL Refactor

This is the refactored backend for the Project Management System, migrated from MongoDB (Mongoose) to PostgreSQL (Drizzle ORM) with full TypeScript support.

## 🚀 Features

- **PostgreSQL** - Robust relational database
- **Drizzle ORM** - Type-safe, lightweight ORM
- **TypeScript** - Full type safety throughout
- **Express.js** - Fast, unopinionated web framework
- **Firebase Authentication** - Secure user authentication
- **Socket.io** - Real-time chat and presence
- **RESTful API** - Clean, consistent API design
- **Cursor-based Pagination** - Efficient pagination for large datasets
- **Transaction Support** - ACID-compliant database operations
- **File Uploads** - Profile image support via Multer
- **Email Notifications** - Sendinblue integration
- **External APIs** - Jira and Trello integrations

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Firebase Admin SDK credentials
- Sendinblue API key
- Jira API credentials (optional)
- Trello API credentials (optional)

## 🔧 Installation

### 1. Clone and Install Dependencies

```bash
cd projects-management-backend
npm install
```

### 2. Set Up PostgreSQL

```bash
# Create database
createdb project_management_db

# Or using psql
psql -U postgres
CREATE DATABASE project_management_db;
```

### 3. Configure Environment Variables

Create `config.env` in the root directory:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/project_management_db

# Firebase
FIREBASE_API_KEY=your_firebase_api_key

# Sendinblue
SENDINBLUE_API_KEY=your_sendinblue_key

# Jira (optional)
JiraBaseUrl=https://your-domain.atlassian.net
Email=your_jira_email
Token=your_jira_token

# Trello (optional)
TRELLO_API_KEY=your_trello_key
TRELLO_API_TOKEN=your_trello_token

# Server
PORT=2000
NODE_ENV=development
FRONTEND_URL=http://127.0.0.1:5173
```

### 4. Set Up Firebase Admin

Place your `serviceAccountKey.json` file in the root directory.

### 5. Run Migrations

```bash
npm run migrate
```

This will create all tables, indexes, and constraints.

### 6. Seed Database (Optional)

```bash
npm run seed
```

This creates sample users, projects, teams, sprints, and reports.

## 🏃 Running the Server

### Development Mode

```bash
npm run dev
```

This uses `tsx watch` for hot-reloading.

### Production Mode

```bash
npm run build
npm start
```

## 📁 Project Structure

```
projects-management-backend/
├── src/
│   ├── db/
│   │   ├── index.ts              # Database connection
│   │   ├── schema/               # Drizzle schema definitions
│   │   │   ├── users.ts
│   │   │   ├── projects.ts
│   │   │   ├── teams.ts
│   │   │   ├── sprints.ts
│   │   │   ├── cards.ts
│   │   │   ├── reports.ts
│   │   │   ├── conversations.ts
│   │   │   └── messages.ts
│   │   ├── migrations/           # SQL migration files
│   │   ├── migrate.ts            # Migration runner
│   │   └── seed.ts               # Seed data script
│   ├── controllers/              # API route handlers
│   │   ├── AuthController.ts
│   │   ├── UserController.ts
│   │   ├── ProjectController.ts
│   │   ├── TeamController.ts
│   │   ├── SprintController.ts
│   │   ├── CardController.ts
│   │   ├── ReportController.ts
│   │   ├── ConversationController.ts
│   │   ├── MessageController.ts
│   │   ├── JiraApiController.ts
│   │   ├── TrelloController.ts
│   │   └── EmailController.ts
│   ├── middleware/               # Express middleware
│   │   └── auth.ts
│   ├── socket/                   # Socket.io handlers
│   │   └── Chat.ts
│   ├── utils/                    # Utility functions
│   │   ├── pagination.ts
│   │   ├── errors.ts
│   │   ├── errorHandler.ts
│   │   └── types.ts
│   └── index.ts                  # Main server file
├── drizzle.config.ts             # Drizzle configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json
└── README_REFACTOR.md           # This file
```

## 🗄️ Database Schema

### Core Tables

- **users** - User accounts and profiles
- **projects** - Project information
- **teams** - Team definitions
- **team_leads** - Many-to-many: Teams ↔ Users (as leads)
- **team_members** - Many-to-many: Teams ↔ Users (as members)
- **sprints** - Sprint definitions
- **cards** - Task cards
- **sprint_cards** - Many-to-many: Cards ↔ Sprints
- **reports** - User reports
- **conversations** - Chat conversations
- **conversation_members** - Many-to-many: Conversations ↔ Users
- **messages** - Chat messages

### Relationships

- Projects → Teams (one-to-many)
- Teams → Users (many-to-many via join tables)
- Sprints → Cards (many-to-many via sprint_cards)
- Users → Reports (one-to-many)
- Conversations → Users (many-to-many via conversation_members)
- Conversations → Messages (one-to-many)

## 🔌 API Endpoints

### Authentication
- `POST /api/exchangeToken` - Exchange refresh token for ID token

### Users
- `POST /api/register` - Register new user
- `POST /api/login` - Login user
- `GET /api/users` - Get all users (paginated)
- `GET /api/userById/:userId` - Get user by ID
- `GET /api/getProfilePicture/:userId` - Get profile picture
- `POST /api/updateUserInfo` - Update user info
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/randomUsers` - Get random users

### Projects
- `POST /api/createProject` - Create project
- `GET /api/getProject` - Get all projects (paginated)
- `GET /api/editProject/:id` - Get project by ID
- `PUT /api/updateProject/:id` - Update project
- `DELETE /api/deleteProject/:id` - Delete project

### Teams
- `POST /api/teams` - Create team
- `GET /api/teams` - Get all teams
- `GET /api/teams-by-project` - Get teams grouped by project
- `GET /api/teams/with-lead?leadId=xxx` - Get teams where user is lead
- `GET /api/teams/of-employee?employeeId=xxx` - Get teams where user is member
- `PUT /api/teams/:id` - Update team
- `DELETE /api/teams/:id` - Delete team

### Sprints
- `POST /api/sprint` - Create sprint
- `GET /api/sprints` - Get all sprints (paginated)
- `GET /api/sprint/:id` - Get sprint by ID
- `PUT /api/sprint/:id` - Update sprint
- `DELETE /api/sprint/:id` - Delete sprint

### Cards
- `POST /api/sprint/:sprintId` - Create card and assign to sprint
- `GET /api/sprint/:sprintId` - Get cards for sprint
- `GET /api/card/:cardId` - Get card by ID
- `PUT /api/card/:cardId` - Update card
- `DELETE /api/card/:cardId` - Delete card

### Reports
- `POST /api/createReport` - Create report
- `GET /api/getReport` - Get all reports (paginated)
- `GET /api/editReport/:id` - Get report by ID
- `PUT /api/updateReport/:id` - Update report
- `DELETE /api/deleteReport/:id` - Delete report

### Conversations
- `POST /api/conversation` - Create/get conversation between two users
- `POST /api/groupChat` - Create/get group chat
- `POST /api/groupChat/addUser` - Add user to group chat
- `GET /api/conversation/:userId` - Get conversations for user

### Messages
- `POST /api/message` - Create message
- `GET /api/messages/:conversationId` - Get messages for conversation (paginated)

### External Integrations
- `GET /api/statistics/:projectKey` - Get Jira statistics
- `GET /api/users/:projectKey` - Get Jira project users
- `GET /api/combinedStats/:boardId` - Get Trello combined stats
- `GET /api/numberOfCards/:boardId` - Get Trello cards per list
- `GET /api/numberOfCardsCreatedForDaysLastWeek/:boardId` - Get Trello weekly stats

### Email
- `POST /api/message-Email` - Send message email
- `POST /api/email` - Send single email

## 📝 Pagination

All list endpoints support cursor-based pagination:

```
GET /api/users?limit=20&cursor=eyJpZCI6MTB9&orderBy=desc&orderByColumn=createdAt
```

Parameters:
- `limit` - Number of results (default: 20, max: 100)
- `cursor` - Base64 encoded cursor for pagination
- `orderBy` - "asc" or "desc" (default: "asc")
- `orderByColumn` - Column to order by (default: "id")

Response includes:
- `data` - Array of results
- `nextCursor` - Cursor for next page (null if no more)
- `hasMore` - Boolean indicating if more results exist

## 🔐 Authentication

The API uses Firebase Authentication with JWT tokens:

1. Client authenticates with Firebase
2. Client sends Firebase ID token in `Authorization` header
3. Server verifies token using Firebase Admin SDK
4. Server attaches user to request object
5. Controllers can use `req.user` to access authenticated user

Example:
```typescript
app.get('/api/protected', authenticateUser, (req, res) => {
  // req.user is available here
  res.json({ user: req.user });
});
```

## 🎯 Socket.io Events

### Client → Server
- `addUser` - Add user to online users list
- `joinGroup` - Join a group conversation
- `sendMessage` - Send a message
- `leaveGroup` - Leave a group conversation

### Server → Client
- `getUsers` - List of online users
- `getMessage` - New message received
- `userJoined` - User joined a group
- `userLeft` - User left a group

## 🔄 Migration from MongoDB

See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for detailed migration instructions.

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Check database connection
npm run migrate

# Seed test data
npm run seed
```

## 📊 Performance Considerations

- All foreign keys are indexed
- Frequently queried columns have indexes
- Connection pooling is enabled
- Cursor-based pagination for efficient large dataset queries
- Transactions for data consistency

## 🛠️ Development

### TypeScript Compilation

```bash
npm run build
```

### Watch Mode

```bash
npm run dev
```

### Generate Drizzle Migrations

```bash
npm run migrate:generate
```

### Push Schema to Database (Development)

```bash
npm run migrate:push
```

## 📚 Additional Resources

- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Express.js Documentation](https://expressjs.com/)
- [Socket.io Documentation](https://socket.io/docs/)

## 📄 License

[Your License Here]

## 🤝 Contributing

[Your Contributing Guidelines Here]

---

**Note**: This is a refactored version migrated from MongoDB to PostgreSQL. For migration instructions, see [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md).
