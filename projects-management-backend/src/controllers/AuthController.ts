import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import { db } from "@db/index";
import { users } from "@db/schema/users";
import { refreshTokens } from "@db/schema/refreshTokens";
import { eq, and, gte } from "drizzle-orm";
import { asyncHandler } from "@utils/errorHandler";
import { BadRequestError, UnauthorizedError, NotFoundError, ConflictError, ForbiddenError } from "@utils/errors";
import {
  generateTokenPair,
  verifyRefreshToken,
  generateRandomToken,
  getRefreshTokenExpiry,
} from "@utils/jwt";
import { validateRequest } from "@middleware/validation";
import {
  registerDtoSchema,
  loginDtoSchema,
  refreshTokenDtoSchema,
  type RegisterDto,
  type LoginDto,
  type RefreshTokenDto,
  type AuthResponse,
} from "@dto/auth.dto";

const authRoute = Router();

/**
 * Register a new user
 * POST /api/auth/register
 */
authRoute.post(
  "/register",
  validateRequest(registerDtoSchema),
  asyncHandler(async (req: Request<{}, {}, RegisterDto>, res: Response) => {
    const { firstName, lastName, email, password, role, phoneNumber, address, birthday, gender } =
      req.body;

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

    // Create user in database
    const [newUser] = await db
      .insert(users)
      .values({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
        status: role === "Admin" ? "approved" : "pending", // Auto-approve admins
        phoneNumber: phoneNumber || null,
        address: address || null,
        birthday: birthday ? new Date(birthday) : null,
        gender: gender || null,
      })
      .returning();

    // Generate tokens
    const tokenPair = generateTokenPair({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    // Store refresh token in database
    const refreshTokenString = generateRandomToken();
    const expiresAt = getRefreshTokenExpiry();

    await db.insert(refreshTokens).values({
      userId: newUser.id,
      token: refreshTokenString,
      expiresAt,
    });

    // Return response (don't send password)
    const response: AuthResponse = {
      accessToken: tokenPair.accessToken,
      refreshToken: refreshTokenString, // Send the stored token, not the JWT
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
      },
    };

    res.status(201).json({
      message: "User registered successfully",
      data: response,
    });
  })
);

/**
 * Login user
 * POST /api/auth/login
 */
authRoute.post(
  "/login",
  validateRequest(loginDtoSchema),
  asyncHandler(async (req: Request<{}, {}, LoginDto>, res: Response) => {
    const { email, password } = req.body;

    // Get user from database
    const userResults = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (userResults.length === 0) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const user = userResults[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    // Check if user is approved
    if (user.status !== "approved") {
      throw new ForbiddenError("Your account is pending approval. Please contact an administrator.");
    }

    // Generate tokens
    const tokenPair = generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Store refresh token in database
    const refreshTokenString = generateRandomToken();
    const expiresAt = getRefreshTokenExpiry();

    await db.insert(refreshTokens).values({
      userId: user.id,
      token: refreshTokenString,
      expiresAt,
    });

    // Return response
    const response: AuthResponse = {
      accessToken: tokenPair.accessToken,
      refreshToken: refreshTokenString, // Send the stored token
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    };

    res.status(200).json({
      message: "Login successful",
      data: response,
    });
  })
);

/**
 * Refresh access token
 * POST /api/auth/refresh
 */
authRoute.post(
  "/refresh",
  validateRequest(refreshTokenDtoSchema),
  asyncHandler(async (req: Request<{}, {}, RefreshTokenDto>, res: Response) => {
    const { refreshToken } = req.body;

    // Find refresh token in database
    const tokenResults = await db
      .select({
        token: refreshTokens,
        user: users,
      })
      .from(refreshTokens)
      .innerJoin(users, eq(refreshTokens.userId, users.id))
      .where(
        and(
          eq(refreshTokens.token, refreshToken),
          gte(refreshTokens.expiresAt, new Date()) // Check expiry
        )
      )
      .limit(1);

    if (tokenResults.length === 0) {
      throw new UnauthorizedError("Invalid or expired refresh token");
    }

    const { token, user } = tokenResults[0];

    // Check if user is approved
    if (user.status !== "approved") {
      throw new ForbiddenError("User account is not approved");
    }

    // Generate new access token
    const newAccessToken = generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
    }).accessToken;

    // Optionally rotate refresh token (delete old, create new)
    await db.transaction(async (tx) => {
      // Delete old refresh token
      await tx.delete(refreshTokens).where(eq(refreshTokens.id, token.id));

      // Create new refresh token
      const newRefreshTokenString = generateRandomToken();
      const expiresAt = getRefreshTokenExpiry();

      await tx.insert(refreshTokens).values({
        userId: user.id,
        token: newRefreshTokenString,
        expiresAt,
      });

      // Return both tokens
      res.status(200).json({
        message: "Token refreshed successfully",
        data: {
          accessToken: newAccessToken,
          refreshToken: newRefreshTokenString,
        },
      });
    });
  })
);

/**
 * Logout user (revoke refresh token)
 * POST /api/auth/logout
 */
authRoute.post(
  "/logout",
  asyncHandler(async (req: Request<{}, {}, { refreshToken?: string }>, res: Response) => {
    const { refreshToken } = req.body;

    if (refreshToken) {
      // Delete refresh token from database
      await db.delete(refreshTokens).where(eq(refreshTokens.token, refreshToken));
    }

    res.status(200).json({
      message: "Logged out successfully",
    });
  })
);

/**
 * Get current user (protected route)
 * GET /api/auth/me
 */
authRoute.get(
  "/me",
  asyncHandler(async (req: Request, res: Response) => {
    // User is attached by authenticateJWT middleware
    if (!req.user) {
      throw new UnauthorizedError("Not authenticated");
    }

    // Return user without password
    const { password, ...userWithoutPassword } = req.user;

    res.status(200).json({
      message: "User retrieved successfully",
      data: userWithoutPassword,
    });
  })
);

export { authRoute };
