import { Router, Request, Response } from "express";
import { db } from "@db/index";
import { conversations, conversationMembers } from "@db/schema/conversations";
import { eq, and, inArray } from "drizzle-orm";
import { asyncHandler } from "@utils/errorHandler";
import { NotFoundError, BadRequestError } from "@utils/errors";
import { authenticateJWT } from "@middleware/auth";
import { validateRequest, validateParams } from "@middleware/validation";
import { z } from "zod";
import {
  createConversationDtoSchema,
  createGroupChatDtoSchema,
  addUserToGroupDtoSchema,
  type CreateConversationDto,
  type CreateGroupChatDto,
  type AddUserToGroupDto,
} from "@dto/conversation.dto";

const conversationRoute = Router();

/**
 * Create or get existing conversation between two users (Protected)
 * POST /api/conversations
 */
conversationRoute.post(
  "/conversations",
  authenticateJWT,
  validateRequest(createConversationDtoSchema),
  asyncHandler(async (req: Request<{}, {}, CreateConversationDto>, res: Response) => {
    const { senderId, receiverId } = req.body;

    // Use authenticated user's ID if senderId matches
    if (req.user && senderId !== req.user.id) {
      throw new BadRequestError("You can only create conversations as yourself");
    }

    const userId1 = req.user ? req.user.id : senderId;
    const userId2 = receiverId;

    // Check if conversation already exists between these two users
    const senderConversations = await db
      .select({ conversationId: conversationMembers.conversationId })
      .from(conversationMembers)
      .where(eq(conversationMembers.userId, userId1));

    const receiverConversations = await db
      .select({ conversationId: conversationMembers.conversationId })
      .from(conversationMembers)
      .where(eq(conversationMembers.userId, userId2));

    // Find common conversation (1-on-1, not group)
    const commonConversationIds = senderConversations
      .map((sc) => sc.conversationId)
      .filter((id) => receiverConversations.some((rc) => rc.conversationId === id));

    if (commonConversationIds.length > 0) {
      // Check if any is a 1-on-1 conversation
      const existingConversations = await db
        .select()
        .from(conversations)
        .where(
          and(
            inArray(conversations.id, commonConversationIds),
            eq(conversations.isGroup, false)
          )
        )
        .limit(1);

      if (existingConversations.length > 0) {
        return res.status(200).json({
          success: true,
          message: "Conversation retrieved successfully",
          data: existingConversations[0],
        });
      }
    }

    // Create new conversation
    const result = await db.transaction(async (tx) => {
      const [newConversation] = await tx
        .insert(conversations)
        .values({
          isGroup: false,
        })
        .returning();

      // Add both users as members
      await tx.insert(conversationMembers).values([
        { conversationId: newConversation.id, userId: userId1 },
        { conversationId: newConversation.id, userId: userId2 },
      ]);

      return newConversation;
    });

    res.status(201).json({
      success: true,
      message: "Conversation created successfully",
      data: result,
    });
  })
);

/**
 * Create or get existing group chat (Protected)
 * POST /api/conversations/group
 */
conversationRoute.post(
  "/conversations/group",
  authenticateJWT,
  validateRequest(createGroupChatDtoSchema),
  asyncHandler(async (req: Request<{}, {}, CreateGroupChatDto>, res: Response) => {
    const { members } = req.body;

    // Ensure authenticated user is included
    if (req.user && !members.includes(req.user.id)) {
      members.push(req.user.id);
    }

    const memberIds = [...new Set(members.map((id: number) => parseInt(id.toString())))];

    // Check if group conversation with these exact members already exists
    const allConversations = await db
      .select({
        conversation: conversations,
        member: conversationMembers,
      })
      .from(conversations)
      .innerJoin(conversationMembers, eq(conversations.id, conversationMembers.conversationId))
      .where(eq(conversations.isGroup, true));

    // Group by conversation and check if members match
    const conversationMap = new Map<
      number,
      { conversation: typeof conversations.$inferSelect; memberIds: Set<number> }
    >();
    for (const row of allConversations) {
      if (!conversationMap.has(row.conversation.id)) {
        conversationMap.set(row.conversation.id, {
          conversation: row.conversation,
          memberIds: new Set<number>(),
        });
      }
      conversationMap.get(row.conversation.id)!.memberIds.add(row.member.userId);
    }

    // Check if any existing conversation has the same members
    for (const [convId, data] of conversationMap.entries()) {
      if (
        memberIds.length === data.memberIds.size &&
        memberIds.every((id) => data.memberIds.has(id))
      ) {
        return res.status(200).json({
          success: true,
          message: "Group chat retrieved successfully",
          data: data.conversation,
        });
      }
    }

    // Create new group conversation
    const result = await db.transaction(async (tx) => {
      const [newConversation] = await tx
        .insert(conversations)
        .values({
          isGroup: true,
        })
        .returning();

      // Add all members
      await tx.insert(conversationMembers).values(
        memberIds.map((userId) => ({
          conversationId: newConversation.id,
          userId,
        }))
      );

      return newConversation;
    });

    res.status(201).json({
      success: true,
      message: "Group chat created successfully",
      data: result,
    });
  })
);

/**
 * Add user to group chat (Protected)
 * POST /api/conversations/group/add-user
 */
conversationRoute.post(
  "/conversations/group/add-user",
  authenticateJWT,
  validateRequest(addUserToGroupDtoSchema),
  asyncHandler(async (req: Request<{}, {}, AddUserToGroupDto>, res: Response) => {
    const { conversationId, userId } = req.body;

    // Check if conversation exists and is a group
    const conversationResults = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, conversationId))
      .limit(1);

    if (conversationResults.length === 0) {
      throw new NotFoundError("Conversation not found");
    }

    const conversation = conversationResults[0];
    if (!conversation.isGroup) {
      throw new BadRequestError("Only group conversations can have users added");
    }

    // Check if user is already a member
    const existingMember = await db
      .select()
      .from(conversationMembers)
      .where(
        and(
          eq(conversationMembers.conversationId, conversationId),
          eq(conversationMembers.userId, userId)
        )
      )
      .limit(1);

    if (existingMember.length > 0) {
      return res.status(200).json({
        success: true,
        message: "User is already a member",
        data: conversation,
      });
    }

    // Add user to conversation
    await db.insert(conversationMembers).values({
      conversationId,
      userId,
    });

    res.status(200).json({
      success: true,
      message: "User added to group chat successfully",
      data: conversation,
    });
  })
);

/**
 * Get all conversations for current user (Protected)
 * GET /api/conversations
 */
conversationRoute.get(
  "/conversations",
  authenticateJWT,
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new BadRequestError("User not authenticated");
    }

    // Get all conversations where user is a member
    const conversationResults = await db
      .select({
        conversation: conversations,
      })
      .from(conversationMembers)
      .innerJoin(conversations, eq(conversationMembers.conversationId, conversations.id))
      .where(eq(conversationMembers.userId, req.user.id));

    const uniqueConversations = Array.from(
      new Map(conversationResults.map((row) => [row.conversation.id, row.conversation])).values()
    );

    res.status(200).json({
      success: true,
      message: "Conversations retrieved successfully",
      data: uniqueConversations,
    });
  })
);

export default conversationRoute;
