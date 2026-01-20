// Register path aliases at runtime (for development with tsx)
if (process.env.NODE_ENV !== "production") {
  require("tsconfig-paths/register");
}

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import createError from "http-errors";
import { Server as SocketIOServer } from "socket.io";
import { createServer } from "http";
import * as path from "path";
import moduleAlias from "module-alias";

// Register module aliases for production builds
moduleAlias.addAliases({
  "@": path.join(__dirname, "../"),
  "@controllers": path.join(__dirname, "./controllers"),
  "@models": path.join(__dirname, "./models"),
  "@middleware": path.join(__dirname, "./middleware"),
  "@routes": path.join(__dirname, "./routes"),
  "@socket": path.join(__dirname, "./socket"),
  "@utils": path.join(__dirname, "./utils"),
  "@db": path.join(__dirname, "./db"),
  "@dto": path.join(__dirname, "./dto"),
});

// Import database
import { db } from "@db/index";

// Import controllers
import { authRoute } from "@controllers/AuthController";
import userApi from "@controllers/UserController";
import projectAPI from "@controllers/ProjectController";
import reportAPI from "@controllers/ReportController";
import sprintAPI from "@controllers/SprintController";
import emailAPI from "@controllers/EmailController";
import cardAPI from "@controllers/CardController";
import conversationAPI from "@controllers/ConversationController";
import messageAPI from "@controllers/MessageController";
import teamAPI from "@controllers/TeamController";
import jiraAPI from "@controllers/JiraApiController";
import trelloAPI from "@controllers/TrelloController";

// Import Socket.io handler
import chatSocket from "@socket/Chat";

// Import error handler
import { errorHandler } from "@utils/errorHandler";

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../config.env") });

const app = express();

// Middleware - CORS configuration
// In development, allow all localhost origins; in production, use FRONTEND_URL
const corsOptions = {
  origin: process.env.NODE_ENV === "production" 
    ? (process.env.FRONTEND_URL || "http://localhost:5173")
    : function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
        // Allow requests with no origin (like mobile apps, Postman, etc.)
        if (!origin) {
          return callback(null, true);
        }
        // In development, allow localhost and 127.0.0.1 on any port
        if (origin.includes("localhost") || origin.includes("127.0.0.1")) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

// Create HTTP server for Socket.io
const httpServer = createServer(app);

// Initialize Socket.io
const socketAllowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL]
  : ["http://localhost:5173", "http://127.0.0.1:5173"];

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: socketAllowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Initialize chat socket handler
chatSocket(io);

// API Routes
app.use("/api/auth", authRoute);
app.use("/api", userApi);
app.use("/api", projectAPI);
app.use("/api", reportAPI);
app.use("/api", sprintAPI);
app.use("/api", emailAPI);
app.use("/api", cardAPI);
app.use("/api", teamAPI);
app.use("/api", jiraAPI);
app.use("/api", conversationAPI);
app.use("/api", messageAPI);
app.use("/api", trelloAPI);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
    timestamp: new Date().toISOString(),
    database: "connected",
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Project Management System API",
    version: "3.0.0",
    endpoints: {
      auth: "/api/auth",
      users: "/api/users",
      projects: "/api/projects",
      teams: "/api/teams",
      sprints: "/api/sprints",
      cards: "/api/cards",
      reports: "/api/reports",
      conversations: "/api/conversations",
      messages: "/api/conversations/:conversationId/messages",
    },
  });
});

// 404 handler
app.use((req, res, next) => {
  next(createError(404, "Route not found"));
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const port = process.env.PORT || 2000;

httpServer.listen(port, () => {
  console.log(`✓ Server started on port ${port}`);
  console.log(`✓ Socket.io server initialized on port ${port}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || "development"}`);

  // Test database connection
  db.select()
    .from(require("@db/schema/users").users)
    .limit(1)
    .then(() => {
      console.log("✓ Database connection successful!");
    })
    .catch((error) => {
      console.error("✗ Database connection error:", error);
    });
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  httpServer.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received: closing HTTP server");
  httpServer.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});

export { app, io };
