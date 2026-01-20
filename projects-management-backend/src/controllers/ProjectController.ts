import { Router, Request, Response } from "express";
import { db } from "@db/index";
import { projects } from "@db/schema/projects";
import { eq, desc, asc, sql } from "drizzle-orm";
import { asyncHandler } from "@utils/errorHandler";
import { NotFoundError, BadRequestError, ConflictError } from "@utils/errors";
import { sanitizePaginationParams, createCursor } from "@utils/pagination";
import { authenticateJWT, restrictTo } from "@middleware/auth";
import { validateRequest, validateParams, validateQuery } from "@middleware/validation";
import { z } from "zod";
import {
  createProjectDtoSchema,
  updateProjectDtoSchema,
  type CreateProjectDto,
  type UpdateProjectDto,
} from "@dto/project.dto";

const projectRoute = Router();

/**
 * Create a new project (Protected - Product Owner, Admin)
 * POST /api/projects
 */
projectRoute.post(
  "/projects",
  authenticateJWT,
  restrictTo("Admin", "Product Owner"),
  validateRequest(createProjectDtoSchema),
  asyncHandler(async (req: Request<{}, {}, CreateProjectDto>, res: Response) => {
    const { title, status, startDate, key, listId, boardId, isJiraProject } = req.body;

    // Check if project with same title already exists
    const existingProjects = await db
      .select()
      .from(projects)
      .where(eq(projects.title, title))
      .limit(1);

    if (existingProjects.length > 0) {
      throw new ConflictError("Project with this title already exists");
    }

    const [newProject] = await db
      .insert(projects)
      .values({
        title,
        status: status || null,
        startDate: startDate ? new Date(startDate) : null,
        key: key || null,
        listId: listId || null,
        boardId: boardId || null,
        isJiraProject: isJiraProject || null,
      })
      .returning();

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: newProject,
    });
  })
);

/**
 * Get all projects with pagination (Protected)
 * GET /api/projects?limit=20&cursor=...
 */
projectRoute.get(
  "/projects",
  authenticateJWT,
  validateQuery(
    z.object({
      limit: z.string().regex(/^\d+$/).transform(Number).optional(),
      cursor: z.string().optional(),
      orderBy: z.enum(["asc", "desc"]).optional(),
      orderByColumn: z.string().optional(),
    })
  ),
  asyncHandler(async (req: Request, res: Response) => {
    const { limit, cursor, orderBy, orderByColumn } = sanitizePaginationParams({
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      cursor: req.query.cursor as string,
      orderBy: req.query.orderBy as "asc" | "desc",
      orderByColumn: req.query.orderByColumn as string,
    });

    const orderColumn =
      orderByColumn === "title"
        ? projects.title
        : orderByColumn === "createdAt"
        ? projects.createdAt
        : projects.id;

    let query = db.select().from(projects);

    // Apply cursor-based pagination
    if (cursor && cursor.id) {
      if (orderBy === "desc") {
        query = query.where(sql`${orderColumn} < ${cursor.id}`) as any;
      } else {
        query = query.where(sql`${orderColumn} > ${cursor.id}`) as any;
      }
    }

    // Apply ordering and limit
    const results = await query
      .orderBy(orderBy === "desc" ? desc(orderColumn) : asc(orderColumn))
      .limit(limit + 1);

    const hasMore = results.length > limit;
    const data = hasMore ? results.slice(0, limit) : results;

    const nextCursor =
      hasMore && data.length > 0 ? createCursor({ id: data[data.length - 1].id }) : null;

    res.status(200).json({
      success: true,
      message: "Projects retrieved successfully",
      data,
      nextCursor,
      hasMore,
    });
  })
);

/**
 * Get project by ID (Protected)
 * GET /api/projects/:id
 */
projectRoute.get(
  "/projects/:id",
  authenticateJWT,
  validateParams(z.object({ id: z.string().regex(/^\d+$/).transform(Number) })),
  asyncHandler(async (req: Request, res: Response) => {
    const projectId = parseInt(req.params.id);

    if (isNaN(projectId)) {
      throw new BadRequestError("Invalid project ID");
    }

    const projectResults = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);

    if (projectResults.length === 0) {
      throw new NotFoundError("Project not found");
    }

    res.status(200).json({
      success: true,
      message: "Project retrieved successfully",
      data: projectResults[0],
    });
  })
);

/**
 * Update project (Protected - Product Owner, Admin)
 * PUT /api/projects/:id
 */
projectRoute.put(
  "/projects/:id",
  authenticateJWT,
  restrictTo("Admin", "Product Owner"),
  validateParams(z.object({ id: z.string().regex(/^\d+$/).transform(Number) })),
  validateRequest(updateProjectDtoSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const projectId = parseInt(req.params.id);

    if (isNaN(projectId)) {
      throw new BadRequestError("Invalid project ID");
    }

    const { title, status, startDate, key, listId, boardId, isJiraProject } =
      req.body as UpdateProjectDto;

    // Check if title is being changed and is unique
    if (title) {
      const existingProjects = await db
        .select()
        .from(projects)
        .where(eq(projects.title, title))
        .limit(1);

      if (existingProjects.length > 0 && existingProjects[0].id !== projectId) {
        throw new ConflictError("Project with this title already exists");
      }
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (status !== undefined) updateData.status = status;
    if (startDate !== undefined) updateData.startDate = startDate ? new Date(startDate) : null;
    if (key !== undefined) updateData.key = key;
    if (listId !== undefined) updateData.listId = listId;
    if (boardId !== undefined) updateData.boardId = boardId;
    if (isJiraProject !== undefined) updateData.isJiraProject = isJiraProject;

    const [updatedProject] = await db
      .update(projects)
      .set(updateData)
      .where(eq(projects.id, projectId))
      .returning();

    if (!updatedProject) {
      throw new NotFoundError("Project not found");
    }

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: updatedProject,
    });
  })
);

/**
 * Delete project (Protected - Product Owner, Admin)
 * DELETE /api/projects/:id
 */
projectRoute.delete(
  "/projects/:id",
  authenticateJWT,
  restrictTo("Admin", "Product Owner"),
  validateParams(z.object({ id: z.string().regex(/^\d+$/).transform(Number) })),
  asyncHandler(async (req: Request, res: Response) => {
    const projectId = parseInt(req.params.id);

    if (isNaN(projectId)) {
      throw new BadRequestError("Invalid project ID");
    }

    const [deletedProject] = await db
      .delete(projects)
      .where(eq(projects.id, projectId))
      .returning();

    if (!deletedProject) {
      throw new NotFoundError("Project not found");
    }

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
      data: deletedProject,
    });
  })
);

export default projectRoute;
