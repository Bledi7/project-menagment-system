import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import { db } from "@db/index";
import { users } from "@db/schema/users";
import { eq, and, ne, sql, asc, desc } from "drizzle-orm";
import { asyncHandler } from "@utils/errorHandler";
import { NotFoundError, BadRequestError, ConflictError, ForbiddenError } from "@utils/errors";
import { sanitizePaginationParams, createCursor } from "@utils/pagination";
import { authenticateJWT, restrictTo } from "@middleware/auth";
import { validateRequest, validateParams, validateQuery } from "@middleware/validation";
import { z } from "zod";
import multer from "multer";
import * as fs from "fs";
import * as path from "path";
import {
  createUserDtoSchema,
  updateUserDtoSchema,
  updateUserProfileDtoSchema,
  type CreateUserDto,
  type UpdateUserDto,
  type UpdateUserProfileDto,
} from "@dto/user.dto";

const userRoute = Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `profile-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new BadRequestError("Invalid file type. Only images are allowed."));
    }
  },
});

/**
 * Get all users with pagination (Protected - Admin only)
 * GET /api/users?limit=20&cursor=...
 */
userRoute.get(
  "/users",
  authenticateJWT,
  restrictTo("Admin"),
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
      orderByColumn === "email"
        ? users.email
        : orderByColumn === "firstName"
        ? users.firstName
        : orderByColumn === "createdAt"
        ? users.createdAt
        : users.id;

    let query = db.select().from(users);

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

    // Remove passwords from response
    const usersWithoutPassword = data.map(({ password, ...user }) => user);

    const nextCursor =
      hasMore && usersWithoutPassword.length > 0
        ? createCursor({ id: usersWithoutPassword[usersWithoutPassword.length - 1].id })
        : null;

    res.status(200).json({
      message: "Users retrieved successfully",
      data: usersWithoutPassword,
      nextCursor,
      hasMore,
    });
  })
);

/**
 * Get user by ID (Protected)
 * GET /api/users/:userId
 */
userRoute.get(
  "/users/:userId",
  authenticateJWT,
  validateParams(z.object({ userId: z.string().regex(/^\d+$/).transform(Number) })),
  asyncHandler(async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
      throw new BadRequestError("Invalid user ID");
    }

    // Users can only view their own profile unless they're Admin
    if (req.user && req.user.id !== userId && req.user.role !== "Admin") {
      throw new ForbiddenError("You can only view your own profile");
    }

    const userResults = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (userResults.length === 0) {
      throw new NotFoundError("User not found");
    }

    const { password, ...userWithoutPassword } = userResults[0];

    res.status(200).json({
      message: "User retrieved successfully",
      data: userWithoutPassword,
    });
  })
);

/**
 * Create user (Protected - Admin only)
 * POST /api/users
 */
userRoute.post(
  "/users",
  authenticateJWT,
  restrictTo("Admin"),
  validateRequest(createUserDtoSchema),
  asyncHandler(async (req: Request<{}, {}, CreateUserDto>, res: Response) => {
    const {
      firstName,
      lastName,
      email,
      password,
      role,
      status,
      phoneNumber,
      address,
      birthday,
      gender,
    } = req.body;

    // Check if user already exists
    const existingUsers = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUsers.length > 0) {
      throw new ConflictError("User with this email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
        status: status || "pending",
        phoneNumber: phoneNumber || null,
        address: address || null,
        birthday: birthday ? new Date(birthday) : null,
        gender: gender || null,
      })
      .returning();

    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      message: "User created successfully",
      data: userWithoutPassword,
    });
  })
);

/**
 * Update user (Protected - Admin or own profile)
 * PUT /api/users/:userId
 */
userRoute.put(
  "/users/:userId",
  authenticateJWT,
  validateParams(z.object({ userId: z.string().regex(/^\d+$/).transform(Number) })),
  validateRequest(updateUserDtoSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
      throw new BadRequestError("Invalid user ID");
    }

    // Check if user can update (Admin or own profile for non-role changes)
    if (!req.user) {
      throw new ForbiddenError("Not authenticated");
    }

    const canUpdateRole = req.user.role === "Admin";
    const isOwnProfile = req.user.id === userId;

    if (!isOwnProfile && !canUpdateRole) {
      throw new ForbiddenError("You can only update your own profile");
    }

    // Non-admins can't update role
    if (!canUpdateRole && req.body.role && req.body.role !== req.user.role) {
      throw new ForbiddenError("You cannot change your role");
    }

    const { firstName, lastName, email, password, role, status, phoneNumber, address, birthday, gender } =
      req.body;

    // Check if email is being changed and is unique
    if (email) {
      const existingUsers = await db
        .select()
        .from(users)
        .where(and(eq(users.email, email), ne(users.id, userId)))
        .limit(1);

      if (existingUsers.length > 0) {
        throw new ConflictError("Email already in use");
      }
    }

    const updateData: any = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (email) updateData.email = email;
    if (role && canUpdateRole) updateData.role = role;
    if (status && canUpdateRole) updateData.status = status;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber || null;
    if (address !== undefined) updateData.address = address || null;
    if (birthday !== undefined) updateData.birthday = birthday ? new Date(birthday) : null;
    if (gender !== undefined) updateData.gender = gender || null;

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning();

    if (!updatedUser) {
      throw new NotFoundError("User not found");
    }

    const { password: _, ...userWithoutPassword } = updatedUser;

    res.status(200).json({
      message: "User updated successfully",
      data: userWithoutPassword,
    });
  })
);

/**
 * Delete user (Protected - Admin only)
 * DELETE /api/users/:userId
 */
userRoute.delete(
  "/users/:userId",
  authenticateJWT,
  restrictTo("Admin"),
  validateParams(z.object({ userId: z.string().regex(/^\d+$/).transform(Number) })),
  asyncHandler(async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
      throw new BadRequestError("Invalid user ID");
    }

    // Prevent deleting own account
    if (req.user && req.user.id === userId) {
      throw new BadRequestError("You cannot delete your own account");
    }

    const [deletedUser] = await db
      .delete(users)
      .where(eq(users.id, userId))
      .returning();

    if (!deletedUser) {
      throw new NotFoundError("User not found");
    }

    // Also delete all refresh tokens for this user (cascade will handle this if set)

    const { password, ...userWithoutPassword } = deletedUser;

    res.status(200).json({
      message: "User deleted successfully",
      data: userWithoutPassword,
    });
  })
);

/**
 * Update user profile (Protected - own profile)
 * POST /api/users/profile
 */
userRoute.post(
  "/users/profile",
  authenticateJWT,
  upload.single("profileImage"),
  validateRequest(updateUserProfileDtoSchema),
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ForbiddenError("Not authenticated");
    }

    const {
      phoneNumber,
      address,
      birthday,
      gender,
      instagram,
      twitter,
      gitHub,
      facebook,
    } = req.body;

    const updateData: any = {
      phoneNumber: phoneNumber || null,
      address: address || null,
      birthday: birthday ? new Date(birthday) : null,
      gender: gender || null,
      instagram: instagram || null,
      twitter: twitter || null,
      gitHub: gitHub || null,
      facebook: facebook || null,
    };

    // Handle profile image upload
    if (req.file) {
      updateData.profileImagePath = `uploads/${req.file.filename}`;
      updateData.profileImageContentType = req.file.mimetype;
    }

    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, req.user.id))
      .returning();

    if (!updatedUser) {
      throw new NotFoundError("User not found");
    }

    const { password, ...userWithoutPassword } = updatedUser;

    res.status(200).json({
      message: "Profile updated successfully",
      data: userWithoutPassword,
    });
  })
);

/**
 * Get profile picture
 * GET /api/users/:userId/profile-picture
 */
userRoute.get(
  "/users/:userId/profile-picture",
  authenticateJWT,
  validateParams(z.object({ userId: z.string().regex(/^\d+$/).transform(Number) })),
  asyncHandler(async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
      throw new BadRequestError("Invalid user ID");
    }

    const userResults = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (userResults.length === 0 || !userResults[0].profileImagePath) {
      throw new NotFoundError("User or profile image not found");
    }

    const user = userResults[0];
    const imagePath = path.join(__dirname, "../../", user.profileImagePath);

    if (!fs.existsSync(imagePath)) {
      throw new NotFoundError("Profile image file not found");
    }

    res.setHeader("Content-Type", user.profileImageContentType || "image/jpeg");
    res.sendFile(imagePath);
  })
);

/**
 * Get random users (Protected)
 * GET /api/users/random
 */
userRoute.get(
  "/users/random",
  authenticateJWT,
  validateQuery(z.object({ excludeId: z.string().regex(/^\d+$/).transform(Number).optional() })),
  asyncHandler(async (req: Request, res: Response) => {
    const excludeId = req.query.excludeId ? parseInt(req.query.excludeId as string) : req.user?.id;

    let query = db.select().from(users).limit(4);

    if (excludeId) {
      query = query.where(ne(users.id, excludeId)) as any;
    }

    const results = await query;

    const usersWithoutPassword = results.map(({ password, ...user }) => user);

    res.status(200).json({
      message: "Random users retrieved successfully",
      data: usersWithoutPassword,
    });
  })
);

export default userRoute;
