import { Router, Request, Response } from "express";
import { db } from "@db/index";
import { messages } from "@db/schema/messages";
import { conversationMembers } from "@db/schema/conversations";
import { eq, and, desc, asc, sql } from "drizzle-orm";
import { asyncHandler } from "@utils/errorHandler";
import { NotFoundError, BadRequestError, ForbiddenError } from "@utils/errors";
import { sanitizePaginationParams, createCursor } from "@utils/pagination";
import { authenticateJWT } from "@middleware/auth";
import { validateRequest, validateParams, validateQuery } from "@middleware/validation";
import { z } from "zod";
import { createMessageDtoSchema, type CreateMessageDto } from "@dto/message.dto";

const messageRoute = Router();

/**
 * Create a new message (Protected)
 * POST /api/messages
 */
messageRoute.post(
  "/messages",
  authenticateJWT,
  validateRequest(createMessageDtoSchema),
  asyncHandler(async (req: Request<{}, {}, CreateMessageDto>, res: Response) => {
    const { conversationId, senderId, text } = req.body;

    // Use authenticated user's ID
    const sender = req.user ? req.user.id : senderId;

    if (!req.user) {
      throw new BadRequestError("User not authenticated");
    }

    // Verify user is a member of the conversation
    const memberResults = await db
      .select()
      .from(conversationMembers)
      .where(
        and(
          eq(conversationMembers.conversationId, conversationId),
          eq(conversationMembers.userId, sender)
        )
      )
      .limit(1);

    if (memberResults.length === 0) {
      throw new ForbiddenError("You are not a member of this conversation");
    }

    const [newMessage] = await db
      .insert(messages)
      .values({
        conversationId,
        senderId: sender,
        text,
      })
      .returning();

    res.status(201).json({
      success: true,
      message: "Message created successfully",
      data: newMessage,
    });
  })
);

/**
 * Get all messages for a conversation with pagination (Protected)
 * GET /api/conversations/:conversationId/messages?limit=20&cursor=...
 */
messageRoute.get(
  "/conversations/:conversationId/messages",
  authenticateJWT,
  validateParams(z.object({ conversationId: z.string().regex(/^\d+$/).transform(Number) })),
  validateQuery(
    z.object({
      limit: z.string().regex(/^\d+$/).transform(Number).optional(),
      cursor: z.string().optional(),
      orderBy: z.enum(["asc", "desc"]).optional(),
    })
  ),
  asyncHandler(async (req: Request, res: Response) => {
    const conversationId = parseInt(req.params.conversationId);

    if (isNaN(conversationId)) {
      throw new BadRequestError("Invalid conversation ID");
    }

    if (!req.user) {
      throw new BadRequestError("User not authenticated");
    }

    // Verify user is a member of the conversation
    const memberResults = await db
      .select()
      .from(conversationMembers)
      .where(
        and(
          eq(conversationMembers.conversationId, conversationId),
          eq(conversationMembers.userId, req.user.id)
        )
      )
      .limit(1);

    if (memberResults.length === 0) {
      throw new ForbiddenError("You are not a member of this conversation");
    }

    const { limit, cursor, orderBy } = sanitizePaginationParams({
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      cursor: req.query.cursor as string,
      orderBy: req.query.orderBy as "asc" | "desc",
      orderByColumn: "createdAt",
    });

    let query = db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId));

    // Apply cursor-based pagination
    if (cursor && cursor.id) {
      if (orderBy === "desc") {
        query = query.where(sql`${messages.id} < ${cursor.id}`) as any;
      } else {
        query = query.where(sql`${messages.id} > ${cursor.id}`) as any;
      }
    }

    // Apply ordering (newest first by default for messages)
    const results = await query
      .orderBy(orderBy === "desc" ? desc(messages.createdAt) : asc(messages.createdAt))
      .limit(limit + 1);

    const hasMore = results.length > limit;
    const data = hasMore ? results.slice(0, limit) : results;

    // Reverse if ascending so oldest messages come first
    const sortedData = orderBy === "asc" ? data.reverse() : data;

    const nextCursor =
      hasMore && sortedData.length > 0
        ? createCursor({ id: sortedData[sortedData.length - 1].id })
        : null;

    res.status(200).json({
      success: true,
      message: "Messages retrieved successfully",
      data: sortedData,
      nextCursor,
      hasMore,
    });
  })
);

export default messageRoute;
