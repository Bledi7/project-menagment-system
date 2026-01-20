import { Router, Request, Response } from "express";
import { db } from "@db/index";
import { sprints } from "@db/schema/sprints";
import { eq, desc, asc, sql } from "drizzle-orm";
import { asyncHandler } from "@utils/errorHandler";
import { NotFoundError, BadRequestError } from "@utils/errors";
import { sanitizePaginationParams, createCursor } from "@utils/pagination";
import { authenticateJWT, restrictTo } from "@middleware/auth";
import { validateRequest, validateParams, validateQuery } from "@middleware/validation";
import { z } from "zod";
import { createSprintDtoSchema, updateSprintDtoSchema, type CreateSprintDto, type UpdateSprintDto } from "@dto/sprint.dto";

const sprintRoute = Router();

/**
 * Create a new sprint (Protected - Product Owner, Scrum Master, Admin)
 * POST /api/sprints
 */
sprintRoute.post(
  "/sprints",
  authenticateJWT,
  restrictTo("Admin", "Product Owner", "Scrum Master"),
  validateRequest(createSprintDtoSchema),
  asyncHandler(async (req: Request<{}, {}, CreateSprintDto>, res: Response) => {
    const { title, projectId } = req.body;

    const [newSprint] = await db
      .insert(sprints)
      .values({
        title,
        projectId: projectId || null,
      })
      .returning();

    res.status(201).json({
      success: true,
      message: "Sprint created successfully",
      data: newSprint,
    });
  })
);

/**
 * Get all sprints with pagination (Protected)
 * GET /api/sprints?limit=20&cursor=...
 */
sprintRoute.get(
  "/sprints",
  authenticateJWT,
  validateQuery(
    z.object({
      limit: z.string().regex(/^\d+$/).transform(Number).optional(),
      cursor: z.string().optional(),
      orderBy: z.enum(["asc", "desc"]).optional(),
      orderByColumn: z.string().optional(),
      projectId: z.string().regex(/^\d+$/).transform(Number).optional(),
    })
  ),
  asyncHandler(async (req: Request, res: Response) => {
    const { limit, cursor, orderBy, orderByColumn } = sanitizePaginationParams({
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      cursor: req.query.cursor as string,
      orderBy: req.query.orderBy as "asc" | "desc",
      orderByColumn: req.query.orderByColumn as string,
    });

    const projectId = req.query.projectId ? parseInt(req.query.projectId as string) : undefined;

    let query = db.select().from(sprints);

    // Filter by project if provided
    if (projectId) {
      query = query.where(eq(sprints.projectId, projectId)) as any;
    }

    // Apply cursor-based pagination
    if (cursor && cursor.id) {
      if (orderBy === "desc") {
        query = query.where(sql`${sprints.id} < ${cursor.id}`) as any;
      } else {
        query = query.where(sql`${sprints.id} > ${cursor.id}`) as any;
      }
    }

    // Apply ordering and limit
    const results = await query
      .orderBy(orderBy === "desc" ? desc(sprints.id) : asc(sprints.id))
      .limit(limit + 1);

    const hasMore = results.length > limit;
    const data = hasMore ? results.slice(0, limit) : results;

    const nextCursor =
      hasMore && data.length > 0 ? createCursor({ id: data[data.length - 1].id }) : null;

    res.status(200).json({
      success: true,
      message: "Sprints retrieved successfully",
      data,
      nextCursor,
      hasMore,
    });
  })
);

/**
 * Get a sprint by ID (Protected)
 * GET /api/sprints/:id
 */
sprintRoute.get(
  "/sprints/:id",
  authenticateJWT,
  validateParams(z.object({ id: z.string().regex(/^\d+$/).transform(Number) })),
  asyncHandler(async (req: Request, res: Response) => {
    const sprintId = parseInt(req.params.id);

    if (isNaN(sprintId)) {
      throw new BadRequestError("Invalid sprint ID");
    }

    const sprintResults = await db
      .select()
      .from(sprints)
      .where(eq(sprints.id, sprintId))
      .limit(1);

    if (sprintResults.length === 0) {
      throw new NotFoundError("Sprint not found");
    }

    res.status(200).json({
      success: true,
      message: "Sprint retrieved successfully",
      data: sprintResults[0],
    });
  })
);

/**
 * Update a sprint (Protected - Product Owner, Scrum Master, Admin)
 * PUT /api/sprints/:id
 */
sprintRoute.put(
  "/sprints/:id",
  authenticateJWT,
  restrictTo("Admin", "Product Owner", "Scrum Master"),
  validateParams(z.object({ id: z.string().regex(/^\d+$/).transform(Number) })),
  validateRequest(updateSprintDtoSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const sprintId = parseInt(req.params.id);

    if (isNaN(sprintId)) {
      throw new BadRequestError("Invalid sprint ID");
    }

    const { title, projectId } = req.body as UpdateSprintDto;

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (projectId !== undefined) updateData.projectId = projectId;

    const [updatedSprint] = await db
      .update(sprints)
      .set(updateData)
      .where(eq(sprints.id, sprintId))
      .returning();

    if (!updatedSprint) {
      throw new NotFoundError("Sprint not found");
    }

    res.status(200).json({
      success: true,
      message: "Sprint updated successfully",
      data: updatedSprint,
    });
  })
);

/**
 * Delete a sprint (Protected - Product Owner, Scrum Master, Admin)
 * DELETE /api/sprints/:id
 */
sprintRoute.delete(
  "/sprints/:id",
  authenticateJWT,
  restrictTo("Admin", "Product Owner", "Scrum Master"),
  validateParams(z.object({ id: z.string().regex(/^\d+$/).transform(Number) })),
  asyncHandler(async (req: Request, res: Response) => {
    const sprintId = parseInt(req.params.id);

    if (isNaN(sprintId)) {
      throw new BadRequestError("Invalid sprint ID");
    }

    const [deletedSprint] = await db
      .delete(sprints)
      .where(eq(sprints.id, sprintId))
      .returning();

    if (!deletedSprint) {
      throw new NotFoundError("Sprint not found");
    }

    res.status(200).json({
      success: true,
      message: "Sprint deleted successfully",
      data: deletedSprint,
    });
  })
);

export default sprintRoute;
