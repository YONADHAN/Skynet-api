import jwt, { JwtPayload } from 'jsonwebtoken'
import { AUTH_CONSTANTS } from '@/constants/auth.constants.js'

interface TokenPayload {
  userId: string
  role: 'admin' | 'user'
}

export class JWTService {
  private accessSecret = process.env.JWT_ACCESS_SECRET as string
  private refreshSecret = process.env.JWT_REFRESH_SECRET as string

  // 🔐 CREATE ACCESS TOKEN
  signAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.accessSecret, {
      expiresIn: AUTH_CONSTANTS.ACCESS_TOKEN_EXPIRY,
    })
  }

  // 🔐 CREATE REFRESH TOKEN
  signRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.refreshSecret, {
      expiresIn: AUTH_CONSTANTS.REFRESH_TOKEN_EXPIRY,
    })
  }

  // ✅ VERIFY ACCESS TOKEN
  verifyAccessToken(token: string): JwtPayload {
    return jwt.verify(token, this.accessSecret) as JwtPayload
  }

  // ✅ VERIFY REFRESH TOKEN
  verifyRefreshToken(token: string): JwtPayload {
    return jwt.verify(token, this.refreshSecret) as JwtPayload
  }

  // 🧠 DECODE ACCESS TOKEN (NO VERIFY)
  decodeAccessToken(token: string): JwtPayload | null {
    return jwt.decode(token) as JwtPayload | null
  }
}
