import { Router, Request, Response } from "express";
import { db } from "@db/index";
import { reports } from "@db/schema/reports";
import { eq, and, desc, asc, sql } from "drizzle-orm";
import { asyncHandler } from "@utils/errorHandler";
import { NotFoundError, BadRequestError, ForbiddenError } from "@utils/errors";
import { sanitizePaginationParams, createCursor } from "@utils/pagination";
import { authenticateJWT, restrictTo } from "@middleware/auth";
import { validateRequest, validateParams, validateQuery } from "@middleware/validation";
import { z } from "zod";
import {
  createReportDtoSchema,
  updateReportDtoSchema,
  type CreateReportDto,
  type UpdateReportDto,
} from "@dto/report.dto";

const reportRoute = Router();

/**
 * Create a new report (Protected)
 * POST /api/reports
 */
reportRoute.post(
  "/reports",
  authenticateJWT,
  validateRequest(createReportDtoSchema),
  asyncHandler(async (req: Request<{}, {}, CreateReportDto>, res: Response) => {
    const { userName, userId, date, report, isFavorite, isRead } = req.body;

    // Use authenticated user's ID if userId not provided
    const reportUserId = userId || (req.user ? req.user.id : null);

    // Non-admins can only create reports for themselves
    if (req.user && req.user.role !== "Admin" && userId && userId !== req.user.id) {
      throw new ForbiddenError("You can only create reports for yourself");
    }

    const [newReport] = await db
      .insert(reports)
      .values({
        userName: userName || (req.user ? `${req.user.firstName} ${req.user.lastName}` : null),
        userId: reportUserId,
        date: new Date(date),
        report,
        isFavorite: isFavorite || false,
        isRead: isRead || false,
      })
      .returning();

    res.status(201).json({
      success: true,
      message: "Report created successfully",
      data: newReport,
    });
  })
);

/**
 * Get all reports with pagination (Protected)
 * GET /api/reports?limit=20&cursor=...&userId=...&isFavorite=...
 */
reportRoute.get(
  "/reports",
  authenticateJWT,
  validateQuery(
    z.object({
      limit: z.string().regex(/^\d+$/).transform(Number).optional(),
      cursor: z.string().optional(),
      orderBy: z.enum(["asc", "desc"]).optional(),
      orderByColumn: z.string().optional(),
      userId: z.string().regex(/^\d+$/).transform(Number).optional(),
      isFavorite: z.enum(["true", "false"]).optional(),
      isRead: z.enum(["true", "false"]).optional(),
    })
  ),
  asyncHandler(async (req: Request, res: Response) => {
    const { limit, cursor, orderBy, orderByColumn } = sanitizePaginationParams({
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      cursor: req.query.cursor as string,
      orderBy: req.query.orderBy as "asc" | "desc",
      orderByColumn: req.query.orderByColumn as string,
    });

    const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
    const isFavorite =
      req.query.isFavorite === "true" ? true : req.query.isFavorite === "false" ? false : undefined;
    const isRead =
      req.query.isRead === "true" ? true : req.query.isRead === "false" ? false : undefined;

    // Non-admins can only view their own reports
    let filterUserId = userId;
    if (req.user && req.user.role !== "Admin") {
      filterUserId = req.user.id;
    }

    let query = db.select().from(reports);

    // Apply filters
    const conditions = [];
    if (filterUserId) conditions.push(eq(reports.userId, filterUserId));
    if (isFavorite !== undefined) conditions.push(eq(reports.isFavorite, isFavorite));
    if (isRead !== undefined) conditions.push(eq(reports.isRead, isRead));

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    // Apply cursor-based pagination
    if (cursor && cursor.id) {
      if (orderBy === "desc") {
        query = query.where(sql`${reports.id} < ${cursor.id}`) as any;
      } else {
        query = query.where(sql`${reports.id} > ${cursor.id}`) as any;
      }
    }

    // Apply ordering and limit
    const results = await query
      .orderBy(orderBy === "desc" ? desc(reports.id) : asc(reports.id))
      .limit(limit + 1);

    const hasMore = results.length > limit;
    const data = hasMore ? results.slice(0, limit) : results;

    const nextCursor =
      hasMore && data.length > 0 ? createCursor({ id: data[data.length - 1].id }) : null;

    res.status(200).json({
      success: true,
      message: "Reports retrieved successfully",
      data,
      nextCursor,
      hasMore,
    });
  })
);

/**
 * Get report by ID (Protected)
 * GET /api/reports/:id
 */
reportRoute.get(
  "/reports/:id",
  authenticateJWT,
  validateParams(z.object({ id: z.string().regex(/^\d+$/).transform(Number) })),
  asyncHandler(async (req: Request, res: Response) => {
    const reportId = parseInt(req.params.id);

    if (isNaN(reportId)) {
      throw new BadRequestError("Invalid report ID");
    }

    const reportResults = await db
      .select()
      .from(reports)
      .where(eq(reports.id, reportId))
      .limit(1);

    if (reportResults.length === 0) {
      throw new NotFoundError("Report not found");
    }

    const report = reportResults[0];

    // Non-admins can only view their own reports
    if (req.user && req.user.role !== "Admin" && report.userId !== req.user.id) {
      throw new ForbiddenError("You can only view your own reports");
    }

    res.status(200).json({
      success: true,
      message: "Report retrieved successfully",
      data: report,
    });
  })
);

/**
 * Update report (Protected - own report or Admin)
 * PUT /api/reports/:id
 */
reportRoute.put(
  "/reports/:id",
  authenticateJWT,
  validateParams(z.object({ id: z.string().regex(/^\d+$/).transform(Number) })),
  validateRequest(updateReportDtoSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const reportId = parseInt(req.params.id);

    if (isNaN(reportId)) {
      throw new BadRequestError("Invalid report ID");
    }

    // Get existing report
    const reportResults = await db
      .select()
      .from(reports)
      .where(eq(reports.id, reportId))
      .limit(1);

    if (reportResults.length === 0) {
      throw new NotFoundError("Report not found");
    }

    const report = reportResults[0];

    // Non-admins can only update their own reports
    if (req.user && req.user.role !== "Admin" && report.userId !== req.user.id) {
      throw new ForbiddenError("You can only update your own reports");
    }

    const { userName, userId, date, report: reportText, isFavorite, isRead } =
      req.body as UpdateReportDto;

    const updateData: any = {};
    if (userName !== undefined) updateData.userName = userName;
    if (userId !== undefined && req.user && req.user.role === "Admin") {
      updateData.userId = userId;
    }
    if (date !== undefined) updateData.date = new Date(date);
    if (reportText !== undefined) updateData.report = reportText;
    if (isFavorite !== undefined) updateData.isFavorite = isFavorite;
    if (isRead !== undefined) updateData.isRead = isRead;

    const [updatedReport] = await db
      .update(reports)
      .set(updateData)
      .where(eq(reports.id, reportId))
      .returning();

    if (!updatedReport) {
      throw new NotFoundError("Report not found");
    }

    res.status(200).json({
      success: true,
      message: "Report updated successfully",
      data: updatedReport,
    });
  })
);

/**
 * Delete report (Protected - own report or Admin)
 * DELETE /api/reports/:id
 */
reportRoute.delete(
  "/reports/:id",
  authenticateJWT,
  validateParams(z.object({ id: z.string().regex(/^\d+$/).transform(Number) })),
  asyncHandler(async (req: Request, res: Response) => {
    const reportId = parseInt(req.params.id);

    if (isNaN(reportId)) {
      throw new BadRequestError("Invalid report ID");
    }

    // Get existing report
    const reportResults = await db
      .select()
      .from(reports)
      .where(eq(reports.id, reportId))
      .limit(1);

    if (reportResults.length === 0) {
      throw new NotFoundError("Report not found");
    }

    const report = reportResults[0];

    // Non-admins can only delete their own reports
    if (req.user && req.user.role !== "Admin" && report.userId !== req.user.id) {
      throw new ForbiddenError("You can only delete your own reports");
    }

    const [deletedReport] = await db
      .delete(reports)
      .where(eq(reports.id, reportId))
      .returning();

    if (!deletedReport) {
      throw new NotFoundError("Report not found");
    }

    res.status(200).json({
      success: true,
      message: "Report deleted successfully",
      data: deletedReport,
    });
  })
);

export default reportRoute;
