import { Router, Request, Response } from "express";
import { db } from "@db/index";
import { cards } from "@db/schema/cards";
import { sprints } from "@db/schema/sprints";
import { eq, and, desc, asc, sql } from "drizzle-orm";
import { asyncHandler } from "@utils/errorHandler";
import { NotFoundError, BadRequestError, ForbiddenError } from "@utils/errors";
import { sanitizePaginationParams, createCursor } from "@utils/pagination";
import { authenticateJWT, restrictTo } from "@middleware/auth";
import { validateRequest, validateParams, validateQuery } from "@middleware/validation";
import { z } from "zod";
import { createCardDtoSchema, updateCardDtoSchema, type CreateCardDto, type UpdateCardDto } from "@dto/card.dto";

const cardRoute = Router();

/**
 * Create a card and assign it to a sprint (Protected - Developer, Scrum Master, Product Owner, Admin)
 * POST /api/cards
 */
cardRoute.post(
  "/cards",
  authenticateJWT,
  restrictTo("Admin", "Product Owner", "Scrum Master", "Developer"),
  validateRequest(createCardDtoSchema),
  asyncHandler(async (req: Request<{}, {}, CreateCardDto>, res: Response) => {
    const { sprintId, title, description, status, assignedTo } = req.body;

    // Check if sprint exists
    const sprintResults = await db
      .select()
      .from(sprints)
      .where(eq(sprints.id, sprintId))
      .limit(1);

    if (sprintResults.length === 0) {
      throw new NotFoundError("Sprint not found");
    }

    // Create card
    const [newCard] = await db
      .insert(cards)
      .values({
        sprintId,
        title,
        description: description || null,
        status: status || "todo",
        assignedTo: assignedTo || null,
      })
      .returning();

    res.status(201).json({
      success: true,
      message: "Card created successfully",
      data: newCard,
    });
  })
);

/**
 * Get all cards for a sprint with pagination (Protected)
 * GET /api/cards?sprintId=123&limit=20&cursor=...
 */
cardRoute.get(
  "/cards",
  authenticateJWT,
  validateQuery(
    z.object({
      sprintId: z.string().regex(/^\d+$/).transform(Number).optional(),
      limit: z.string().regex(/^\d+$/).transform(Number).optional(),
      cursor: z.string().optional(),
      orderBy: z.enum(["asc", "desc"]).optional(),
      status: z.enum(["todo", "in_progress", "done"]).optional(),
      assignedTo: z.string().regex(/^\d+$/).transform(Number).optional(),
    })
  ),
  asyncHandler(async (req: Request, res: Response) => {
    const { limit, cursor, orderBy } = sanitizePaginationParams({
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      cursor: req.query.cursor as string,
      orderBy: req.query.orderBy as "asc" | "desc",
      orderByColumn: "id",
    });

    const sprintId = req.query.sprintId ? parseInt(req.query.sprintId as string) : undefined;
    const status = req.query.status as "todo" | "in_progress" | "done" | undefined;
    const assignedTo = req.query.assignedTo ? parseInt(req.query.assignedTo as string) : undefined;

    let query = db.select().from(cards);

    // Apply filters
    const conditions = [];
    if (sprintId) conditions.push(eq(cards.sprintId, sprintId));
    if (status) conditions.push(eq(cards.status, status));
    if (assignedTo) conditions.push(eq(cards.assignedTo, assignedTo));

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    // Apply cursor-based pagination
    if (cursor && cursor.id) {
      if (orderBy === "desc") {
        query = query.where(sql`${cards.id} < ${cursor.id}`) as any;
      } else {
        query = query.where(sql`${cards.id} > ${cursor.id}`) as any;
      }
    }

    // Apply ordering and limit
    const results = await query
      .orderBy(orderBy === "desc" ? desc(cards.id) : asc(cards.id))
      .limit(limit + 1);

    const hasMore = results.length > limit;
    const data = hasMore ? results.slice(0, limit) : results;

    const nextCursor =
      hasMore && data.length > 0 ? createCursor({ id: data[data.length - 1].id }) : null;

    res.status(200).json({
      success: true,
      message: "Cards retrieved successfully",
      data,
      nextCursor,
      hasMore,
    });
  })
);

/**
 * Get a single card by ID (Protected)
 * GET /api/cards/:id
 */
cardRoute.get(
  "/cards/:id",
  authenticateJWT,
  validateParams(z.object({ id: z.string().regex(/^\d+$/).transform(Number) })),
  asyncHandler(async (req: Request, res: Response) => {
    const cardId = parseInt(req.params.id);

    if (isNaN(cardId)) {
      throw new BadRequestError("Invalid card ID");
    }

    const cardResults = await db
      .select()
      .from(cards)
      .where(eq(cards.id, cardId))
      .limit(1);

    if (cardResults.length === 0) {
      throw new NotFoundError("Card not found");
    }

    res.status(200).json({
      success: true,
      message: "Card retrieved successfully",
      data: cardResults[0],
    });
  })
);

/**
 * Update a card (Protected - Developer, Scrum Master, Product Owner, Admin)
 * PUT /api/cards/:id
 */
cardRoute.put(
  "/cards/:id",
  authenticateJWT,
  restrictTo("Admin", "Product Owner", "Scrum Master", "Developer"),
  validateParams(z.object({ id: z.string().regex(/^\d+$/).transform(Number) })),
  validateRequest(updateCardDtoSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const cardId = parseInt(req.params.id);

    if (isNaN(cardId)) {
      throw new BadRequestError("Invalid card ID");
    }

    // Check if user can update (must be assigned to card or be Admin/Scrum Master/Product Owner)
    const cardResults = await db
      .select()
      .from(cards)
      .where(eq(cards.id, cardId))
      .limit(1);

    if (cardResults.length === 0) {
      throw new NotFoundError("Card not found");
    }

    const card = cardResults[0];

    // Allow update if user is assigned, or is Admin/Product Owner/Scrum Master
    if (
      req.user &&
      card.assignedTo !== req.user.id &&
      !["Admin", "Product Owner", "Scrum Master"].includes(req.user.role)
    ) {
      throw new ForbiddenError("You can only update cards assigned to you");
    }

    const { sprintId, title, description, status, assignedTo } = req.body as UpdateCardDto;

    // Check if sprint exists if being changed
    if (sprintId) {
      const sprintResults = await db
        .select()
        .from(sprints)
        .where(eq(sprints.id, sprintId))
        .limit(1);

      if (sprintResults.length === 0) {
        throw new NotFoundError("Sprint not found");
      }
    }

    const updateData: any = {};
    if (sprintId !== undefined) updateData.sprintId = sprintId;
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description || null;
    if (status !== undefined) updateData.status = status;
    if (assignedTo !== undefined) updateData.assignedTo = assignedTo || null;

    const [updatedCard] = await db
      .update(cards)
      .set(updateData)
      .where(eq(cards.id, cardId))
      .returning();

    if (!updatedCard) {
      throw new NotFoundError("Card not found");
    }

    res.status(200).json({
      success: true,
      message: "Card updated successfully",
      data: updatedCard,
    });
  })
);

/**
 * Delete a card (Protected - Scrum Master, Product Owner, Admin)
 * DELETE /api/cards/:id
 */
cardRoute.delete(
  "/cards/:id",
  authenticateJWT,
  restrictTo("Admin", "Product Owner", "Scrum Master"),
  validateParams(z.object({ id: z.string().regex(/^\d+$/).transform(Number) })),
  asyncHandler(async (req: Request, res: Response) => {
    const cardId = parseInt(req.params.id);

    if (isNaN(cardId)) {
      throw new BadRequestError("Invalid card ID");
    }

    const [deletedCard] = await db
      .delete(cards)
      .where(eq(cards.id, cardId))
      .returning();

    if (!deletedCard) {
      throw new NotFoundError("Card not found");
    }

    res.status(200).json({
      success: true,
      message: "Card deleted successfully",
      data: deletedCard,
    });
  })
);

export default cardRoute;
