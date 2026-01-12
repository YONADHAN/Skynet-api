import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'

import authRoutes from '@/routes/auth.routes.js'
import productRoutes from '@/routes/product.routes.js'

import { errorMiddleware } from './middlewares/error.middleware.js'
import { apiLimiter } from './middlewares/rateLimiter.middleware.js'
import { Request, Response } from 'express'
const app = express()

app.set('trust proxy', 1) // 🔥 REQUIRED for Render/Vercel (secure cookies)

// Middlewares
const allowedOrigins = [
  // 'http://localhost:5173',
  // 'http://localhost:3000',
  'https://skynet-admin.vercel.app',
  'https://skynet-client.vercel.app',
]

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true) // allow server-to-server
      if (allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true,
  })
)
app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))

app.use('/api/v1/auth', apiLimiter, authRoutes)
app.use('/api/v1/product', apiLimiter, productRoutes)

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'Room app API running' })
})

app.use(errorMiddleware)
export default app
