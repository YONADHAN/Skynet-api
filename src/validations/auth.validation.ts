import { z } from 'zod'

export const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export type SignInDTO = z.infer<typeof SignInSchema>

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
})

export type ChangePasswordDTO = z.infer<typeof ChangePasswordSchema>
