import { AppError } from '@/constants/app-error.js'

export class InvalidCredentialsError extends AppError {
  constructor() {
    super('Invalid credentials', 401, 'INVALID_CREDENTIALS')
  }
}

export class SessionExpiredError extends AppError {
  constructor() {
    super('Session expired', 401, 'SESSION_EXPIRED')
  }
}
