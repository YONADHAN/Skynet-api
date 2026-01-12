import { Request, Response, NextFunction } from 'express'
import { JWTService } from '@/services/jwt.service.js'
import { AUTH_CONSTANTS } from '@/constants/auth.constants.js'

const jwtService = new JWTService()

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string
    role: string
  }
  cookies: any
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.[AUTH_CONSTANTS.ACCESS_TOKEN_COOKIE]

    if (!token) {
      return res
        .status(401)
        .json({ message: 'Unauthorized', code: 'SESSION_EXPIRED' })
    }

    const payload = jwtService.verifyAccessToken(token)

    req.user = {
      userId: payload.userId,
      role: payload.role,
    }

    next()
  } catch (error) {
    return res
      .status(401)
      .json({ message: 'Invalid or expired token', code: 'SESSION_EXPIRED' })
  }
}
