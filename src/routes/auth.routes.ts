import { Router } from 'express'
import { AuthController } from '@/controllers/auth.controller.js'
import { authMiddleware } from '@/middlewares/auth.middleware.js'

const router = Router()
const controller = new AuthController()

router.post('/signin', controller.signin)
router.post('/refresh', controller.refresh)
router.post('/logout', controller.logout)
router.post('/change-password', authMiddleware, controller.changePassword)

export default router
