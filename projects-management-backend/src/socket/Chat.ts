/**
 * Socket.io chat handler with JWT authentication
 */
import { Server as SocketIOServer, Socket } from "socket.io";
import { db } from "@db/index";
import { conversationMembers } from "@db/schema/conversations";
import { messages } from "@db/schema/messages";
import { users } from "@db/schema/users";
import { eq, and, inArray } from "drizzle-orm";
import { verifyAccessToken } from "@utils/jwt";

interface SocketUser {
  userId: number;
  socketId: string;
  email: string;
  role: string;
  groupIds: number[];
}

let users: SocketUser[] = [];

/**
 * Add user to online users list
 */
const addUser = (user: SocketUser): void => {
  const userIndex = users.findIndex((u) => u.userId === user.userId);

  if (userIndex === -1) {
    users.push(user);
  } else {
    users[userIndex] = { ...users[userIndex], ...user };
  }
};

/**
 * Remove user from online users list
 */
const removeUser = (socketId: string): SocketUser | undefined => {
  const index = users.findIndex((user) => user.socketId === socketId);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
  return undefined;
};

/**
 * Get user by userId
 */
const getUser = (userId: number): SocketUser | undefined => {
  return users.find((user) => user.userId === userId);
};

/**
 * Authenticate socket connection using JWT
 */
async function authenticateSocket(socket: Socket): Promise<{ userId: number; email: string; role: string } | null> {
  try {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.replace("Bearer ", "");

    if (!token) {
      socket.emit("error", { message: "No token provided" });
      return null;
    }

    // Verify JWT token
    const payload = verifyAccessToken(token as string);

    // Get user from database to verify status
    const userResults = await db
      .select()
      .from(users)
      .where(and(eq(users.id, payload.userId), eq(users.status, "approved")))
      .limit(1);

    if (userResults.length === 0) {
      socket.emit("error", { message: "User not found or not approved" });
      return null;
    }

    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    };
  } catch (error: any) {
    socket.emit("error", { message: error.message || "Authentication failed" });
    return null;
  }
}

/**
 * Initialize Socket.io chat handlers with JWT authentication
 */
export default (io: SocketIOServer): void => {
  // Socket.io authentication middleware
  io.use(async (socket, next) => {
    const auth = await authenticateSocket(socket);

    if (!auth) {
      return next(new Error("Authentication failed"));
    }

    // Attach user to socket
    (socket as any).user = auth;
    next();
  });

  io.on("connection", async (socket: Socket) => {
    const user = (socket as any).user as { userId: number; email: string; role: string };

    if (!user) {
      socket.disconnect();
      return;
    }

    console.log(`User connected: ${user.email} (${socket.id})`);

    try {
      // Get user's conversation IDs from database
      const userConversations = await db
        .select({ conversationId: conversationMembers.conversationId })
        .from(conversationMembers)
        .where(eq(conversationMembers.userId, user.userId));

      const groupIds = userConversations.map((c) => c.conversationId);

      // Add user to online users
      addUser({
        userId: user.userId,
        socketId: socket.id,
        email: user.email,
        role: user.role,
        groupIds,
      });

      // Emit user list to all clients
      io.emit("getUsers", users.map((u) => ({ userId: u.userId, email: u.email, role: u.role })));

      // Join user's conversation rooms
      for (const conversationId of groupIds) {
        socket.join(`conversation-${conversationId}`);
      }

      // Join a group conversation
      socket.on("joinGroup", async ({ groupId }: { groupId: number }) => {
        try {
          socket.join(`conversation-${groupId}`);

          const socketUser = getUser(user.userId);
          if (socketUser && !socketUser.groupIds.includes(groupId)) {
            socketUser.groupIds.push(groupId);
            io.to(`conversation-${groupId}`).emit("userJoined", {
              userId: user.userId,
              groupId,
            });
          }
        } catch (error) {
          console.error("Error joining group:", error);
          socket.emit("error", { message: "Failed to join group" });
        }
      });

      // Send and receive messages
      socket.on(
        "sendMessage",
        async ({
          receiverId,
          groupId,
          text,
        }: {
          receiverId?: number;
          groupId?: number;
          text: string;
        }) => {
          try {
            if (groupId) {
              // Group message - save to database and broadcast to all group members
              const [newMessage] = await db
                .insert(messages)
                .values({
                  conversationId: groupId,
                  senderId: user.userId,
                  text,
                })
                .returning();

              // Get all members of this conversation from database
              const members = await db
                .select({ userId: conversationMembers.userId })
                .from(conversationMembers)
                .where(eq(conversationMembers.conversationId, groupId));

              const memberUserIds = members.map((m) => m.userId);

              // Broadcast to all online members
              const groupUsers = users.filter((u) => memberUserIds.includes(u.userId));

              groupUsers.forEach((groupUser) => {
                io.to(groupUser.socketId).emit("getMessage", {
                  senderId: user.userId,
                  text,
                  groupId,
                  message: newMessage,
                  timestamp: newMessage.createdAt,
                });
              });

              if (groupUsers.length === 0) {
                console.log(`No online users found in group with ID: ${groupId}`);
              }
            } else if (receiverId) {
              // Private message - need to find or create conversation
              const senderConversations = await db
                .select({ conversationId: conversationMembers.conversationId })
                .from(conversationMembers)
                .where(eq(conversationMembers.userId, user.userId));

              const receiverConversations = await db
                .select({ conversationId: conversationMembers.conversationId })
                .from(conversationMembers)
                .where(eq(conversationMembers.userId, receiverId));

              // Find common conversation (simplified - you might want to improve this)
              const commonConversation = senderConversations.find((sc) =>
                receiverConversations.some((rc) => rc.conversationId === sc.conversationId)
              );

              if (!commonConversation) {
                socket.emit("error", { message: "Conversation not found" });
                return;
              }

              // Save message
              const [newMessage] = await db
                .insert(messages)
                .values({
                  conversationId: commonConversation.conversationId,
                  senderId: user.userId,
                  text,
                })
                .returning();

              // Send to receiver if online
              const receiver = getUser(receiverId);
              if (receiver) {
                io.to(receiver.socketId).emit("getMessage", {
                  senderId: user.userId,
                  text,
                  groupId: null,
                  message: newMessage,
                  timestamp: newMessage.createdAt,
                });
              } else {
                console.log(`User with userId ${receiverId} not found online.`);
              }
            } else {
              socket.emit("error", { message: "Either receiverId or groupId must be provided" });
            }
          } catch (error) {
            console.error("Error sending message:", error);
            socket.emit("error", { message: "Failed to send message" });
          }
        }
      );

      // Leave a group
      socket.on("leaveGroup", ({ groupId }: { groupId: number }) => {
        socket.leave(`conversation-${groupId}`);
        const socketUser = getUser(user.userId);
        if (socketUser) {
          const groupIndex = socketUser.groupIds.indexOf(groupId);
          if (groupIndex !== -1) {
            socketUser.groupIds.splice(groupIndex, 1);
          }
          io.to(`conversation-${groupId}`).emit("userLeft", {
            userId: user.userId,
            groupId,
          });
        }
      });

      // Handle disconnect
      socket.on("disconnect", () => {
        console.log(`User disconnected: ${user.email} (${socket.id})`);
        const removedUser = removeUser(socket.id);
        if (removedUser) {
          // Notify all groups that user left
          removedUser.groupIds.forEach((groupId) => {
            io.to(`conversation-${groupId}`).emit("userLeft", {
              userId: removedUser.userId,
              groupId,
            });
          });
        }
        io.emit("getUsers", users.map((u) => ({ userId: u.userId, email: u.email, role: u.role })));
      });
    } catch (error) {
      console.error("Error setting up socket connection:", error);
      socket.emit("error", { message: "Connection setup failed" });
      socket.disconnect();
    }
  });
};
