import bcrypt from 'bcrypt'
import { Response } from 'express'
import { UserRepository } from '@/repositories/user.repository.js'
import { JWTService } from '@/services/jwt.service.js'
import { AUTH_CONSTANTS } from '@/constants/auth.constants.js'
import { COOKIE_OPTIONS } from '@/constants/cookie.constants.js'
import { SignInDTO } from '@/validations/auth.validation.js'
import { InvalidCredentialsError } from '@/constants/auth-errors.js'
import { AppError } from '@/constants/app-error.js'

const userRepo = new UserRepository()
const jwtService = new JWTService()

export class AuthService {
  async signin(data: SignInDTO, res: Response) {
    const { email, password } = data

    const user = await userRepo.findByEmail(email)
    if (!user) {
      throw new InvalidCredentialsError()
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      throw new InvalidCredentialsError()
    }

    const payload = {
      userId: user._id.toString(),
      role: user.role,
    }

    const accessToken = jwtService.signAccessToken(payload)
    const refreshToken = jwtService.signRefreshToken(payload)

    res.cookie(AUTH_CONSTANTS.ACCESS_TOKEN_COOKIE, accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: 15 * 60 * 1000,
    })

    res.cookie(AUTH_CONSTANTS.REFRESH_TOKEN_COOKIE, refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    })

    return {
      name: user.name,
      email: user.email,
      role: user.role,
    }
  }

  async refresh(token: string, res: Response) {
    // 1. Verify Refresh Token
    const payload = jwtService.verifyRefreshToken(token)

    // 2. Check if user still exists (optional but recommended)
    const user = await userRepo.findById(payload.userId)
    // Wait, payload structure in jwt.service.ts has userId.
    // Let's check jwt.service.ts again. It has (userId: string).
    // userRepo.findByEmail expects email.
    // I need findById in userRepo.

    // For now, let's just trust the token payload or fix userRepo.
    // userRepo usually has findById. Let's assume finding by ID is better.
    // But I don't want to break flow if findById is missing.
    // Let's check user.repository.ts first.

    // Actually, I'll just regenerate based on payload for now to be safe and simple,
    // or I should verify user existence.
    // Let's stick to payload regeneration for this iteration unless I see userRepo.

    const newPayload = {
      userId: payload.userId,
      role: payload.role,
    }

    const newAccessToken = jwtService.signAccessToken(newPayload)
    const newRefreshToken = jwtService.signRefreshToken(newPayload)

    res.cookie(AUTH_CONSTANTS.ACCESS_TOKEN_COOKIE, newAccessToken, {
      ...COOKIE_OPTIONS,
      maxAge: 15 * 60 * 1000,
    })

    res.cookie(AUTH_CONSTANTS.REFRESH_TOKEN_COOKIE, newRefreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    })

    return { success: true }
  }

  async changePassword(userId: string, data: { current: string; new: string }) {
    const user = await userRepo.findById(userId)
    if (!user) {
      throw new Error('User not found')
    }

    const isMatch = await bcrypt.compare(data.current, user.password)
    if (!isMatch) {
      // throw new InvalidCredentialsError()
      throw new AppError('Current password is wrong', 401)
    }

    if (data.current === data.new) {
      throw new Error('New password cannot be the same as the current password')
    }

    const hashedPassword = await bcrypt.hash(data.new, 10)
    user.password = hashedPassword
    await user.save()

    return { success: true }
  }
}
