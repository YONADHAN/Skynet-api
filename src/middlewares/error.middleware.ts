import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { AppError } from '@/constants/app-error.js'

export const errorMiddleware = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: err.issues,
    })
  }

  // Custom app errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      code: err.code,
    })
  }

  // Mongoose validation errors
  if (err && (err as any).name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation failed',
      errors: (err as any).errors,
    })
  }

  // Mongoose duplicate key error
  if (err && (err as any).code === 11000) {
    const field = Object.keys((err as any).keyPattern || {})[0] || 'field'
    return res.status(400).json({
      message: `Duplicate value for ${field}`,
    })
  }

  // Mongoose cast error (invalid ID)
  if (err && (err as any).name === 'CastError') {
    return res.status(400).json({
      message: `Invalid ${(err as any).path}: ${(err as any).value}`,
    })
  }

  // Unknown / system errors
  console.error('Unhandled error:', err)

  return res.status(500).json({
    message: (err as any)?.message || 'Internal server error',
  })
}
