import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { BadRequestError } from "@utils/errors";

/**
 * Request validation middleware using Zod
 */
export function validateRequest(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        next(
          new BadRequestError(
            `Validation failed: ${errors.map((e) => e.message).join(", ")}`
          )
        );
      } else {
        next(new BadRequestError("Invalid request data"));
      }
    }
  };
}

/**
 * Query validation middleware
 */
export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        next(
          new BadRequestError(
            `Query validation failed: ${errors.map((e) => e.message).join(", ")}`
          )
        );
      } else {
        next(new BadRequestError("Invalid query parameters"));
      }
    }
  };
}

/**
 * Params validation middleware
 */
export function validateParams(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        next(
          new BadRequestError(
            `Parameter validation failed: ${errors.map((e) => e.message).join(", ")}`
          )
        );
      } else {
        next(new BadRequestError("Invalid route parameters"));
      }
    }
  };
}
