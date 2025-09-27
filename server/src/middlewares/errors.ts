// src/middlewares/errors.ts

import type { Request, Response, NextFunction } from "express";

type ErrorBody = {
  error: string;
  code?: string;
  details?: unknown;
  stack?: string;
};

const isProd = process.env.NODE_ENV === "production";

// 404 handler
export function notFound(_req: Request, res: Response) {
  res.status(404).json({ error: "Not found" });
}

// Centralized error handler
export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // Default status/message
  let status = typeof err?.status === "number" ? err.status : 500;
  let code: string | undefined;
  let message = err?.message || "Internal server error";
  let details: unknown;

  // Zod validation error
  if (err?.name === "ZodError" && Array.isArray(err.issues)) {
    status = 400;
    code = "VALIDATION_ERROR";
    message = "Validation failed";
    details = err.issues;
  }

  // Mongoose duplicate key error - ignore for reviews
  else if (err?.code === 11000) {
    // For reviews, we want to allow multiple reviews per user per hotel
    // So we'll treat this as a success and return the existing review
    if (err?.keyValue && (err.keyValue.hotel || err.keyValue.recipe)) {
      status = 200;
      code = "REVIEW_EXISTS";
      message = "Review already exists, but continuing...";
      details = { keyValue: err.keyValue };
    } else {
      status = 409;
      code = "DUPLICATE_KEY";
      message = "Resource already exists";
      details = { keyValue: err.keyValue };
    }
  }

  // Mongoose validation error
  else if (err?.name === "ValidationError") {
    status = 400;
    code = "MONGOOSE_VALIDATION";
    message = "Validation failed";
    details = serializeMongooseValidation(err);
  }

  // Mongoose cast error (invalid ObjectId, etc.)
  else if (err?.name === "CastError") {
    status = 400;
    code = "MONGOOSE_CAST";
    message = `Invalid ${err?.path || "value"}`;
    details = { value: err?.value };
  }

  // Body parser JSON error
  else if (isBodyParseError(err)) {
    status = 400;
    code = "BAD_JSON";
    message = "Malformed JSON body";
  }

  // JWT errors
  else if (err?.name === "JsonWebTokenError") {
    status = 401;
    code = "INVALID_TOKEN";
    message = "Invalid token";
  } else if (err?.name === "TokenExpiredError") {
    status = 401;
    code = "TOKEN_EXPIRED";
    message = "Token expired";
  }

  // Rate limit error
  else if (err?.status === 429 || err?.name === "RateLimitError") {
    status = 429;
    code = "RATE_LIMITED";
    message = "Too many requests";
  }

  // Multer limits
  else if (err?.code === "LIMIT_FILE_SIZE") {
    status = 413;
    code = "FILE_TOO_LARGE";
    message = "File too large";
  }

  // Fallback: preserve existing status/message if provided
  if (!code && typeof err?.code === "string") {
    code = err.code;
  }

  const body: ErrorBody = {
    error: message,
    ...(code ? { code } : {}),
    ...(details ? { details } : {}),
    ...(!isProd ? { stack: safeStack(err) } : {}),
  };

  res.status(status).json(body);
}

// Helpers

function isBodyParseError(err: any): boolean {
  // body-parser sets "type" for JSON parse failures; also catch SyntaxError with "body" prop
  return (
    err?.type === "entity.parse.failed" ||
    (err instanceof SyntaxError &&
      Object.prototype.hasOwnProperty.call(err as any, "body"))
  );
}

function serializeMongooseValidation(err: any) {
  // Convert Mongoose ValidationError into a compact shape
  const out: Record<string, string> = {};
  if (err?.errors && typeof err.errors === "object") {
    for (const [path, val] of Object.entries<any>(err.errors)) {
      out[path] = val?.message || "Invalid value";
    }
  }
  return out;
}

function safeStack(err: any) {
  // Avoid leaking huge objects; only return string stack if present
  return typeof err?.stack === "string" ? err.stack : undefined;
}
