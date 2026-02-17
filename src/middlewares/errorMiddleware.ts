import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.js";

export default function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "Error",
      message: err.message
    });
  }

  console.error(err)

  return res.status(500).json({
    status: 'Error',
    message: "Internal Server Error"
  })
}
