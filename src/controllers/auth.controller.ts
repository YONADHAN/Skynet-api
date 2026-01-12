import { Request, Response, NextFunction } from 'express'
import { AuthService } from '@/services/feature/auth.service.js'
import { SignInSchema } from '@/validations/auth.validation.js'
import { AUTH_CONSTANTS } from '@/constants/auth.constants.js'

const authService = new AuthService()

export class AuthController {
  async signin(req: Request, res: Response, next: NextFunction) {
    try {
      const data = SignInSchema.parse(req.body)
      const user = await authService.signin(data, res)

      return res.status(200).json({
        success: true,
        user,
      })
    } catch (error) {
      next(error) // 🔥 delegate to global middleware
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies?.[AUTH_CONSTANTS.REFRESH_TOKEN_COOKIE]
      if (!token) {
        return res.status(401).json({ message: 'No refresh token' })
      }

      await authService.refresh(token, res)

      return res.status(200).json({ success: true, message: 'Token refreshed' })
    } catch (error) {
      next(error)
    }
  }

  async logout(req: Request, res: Response) {
    res.clearCookie(AUTH_CONSTANTS.ACCESS_TOKEN_COOKIE)
    res.clearCookie(AUTH_CONSTANTS.REFRESH_TOKEN_COOKIE)

    res.status(200).json({ success: true, message: 'Logged out successfully' })
  }

  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { currentPassword, newPassword } = req.body
      const userId = (req as any).user?.userId

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' })
      }

      await authService.changePassword(userId, {
        current: currentPassword,
        new: newPassword,
      })

      res
        .status(200)
        .json({ success: true, message: 'Password changed successfully' })
    } catch (error) {
      next(error)
    }
  }
}
