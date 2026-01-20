import { Request, Response, NextFunction } from "express";
import { db } from "@db/index";
import { users } from "@db/schema/users";
import { eq } from "drizzle-orm";
import { verifyAccessToken } from "@utils/jwt";
import { UnauthorizedError, ForbiddenError } from "@utils/errors";

/**
 * Extend Express Request to include user
 */
declare global {
  namespace Express {
    interface Request {
      user?: typeof users.$inferSelect & { id: number };
    }
  }
}

/**
 * JWT Authentication middleware
 * Verifies access token and attaches user to request
 */
export const authenticateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("No access token provided");
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // Verify token
    const payload = verifyAccessToken(token);

    // Get user from database
    const userResults = await db
      .select()
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1);

    if (userResults.length === 0) {
      throw new UnauthorizedError("User not found");
    }

    const user = userResults[0];

    // Check if user is approved
    if (user.status !== "approved") {
      throw new ForbiddenError("User account is not approved");
    }

    // Attach user to request
    req.user = user;

    next();
  } catch (error) {
    if (error instanceof UnauthorizedError || error instanceof ForbiddenError) {
      next(error);
    } else {
      console.error("Authentication error:", error);
      next(new UnauthorizedError("Invalid or expired access token"));
    }
  }
};

/**
 * Role-based authorization middleware
 * Must be used after authenticateJWT
 */
export const restrictTo = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedError("You are not authenticated"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ForbiddenError(
          `You do not have permission to perform this action. Required roles: ${allowedRoles.join(
            ", "
          )}`
        )
      );
    }

    next();
  };
};

/**
 * Optional authentication middleware
 * Attaches user if token is valid, but doesn't require it
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const payload = verifyAccessToken(token);

      const userResults = await db
        .select()
        .from(users)
        .where(eq(users.id, payload.userId))
        .limit(1);

      if (userResults.length > 0 && userResults[0].status === "approved") {
        req.user = userResults[0];
      }
    }

    next();
  } catch {
    // If token is invalid, just continue without user
    next();
  }
};
