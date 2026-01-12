import 'dotenv/config' // 👈 Load env vars BEFORE everything else
import app from '@/app.js'
import { connectDB } from '@/config/db.js'
import { seedAdmin } from '@/services/admin.seed.js'

const PORT = process.env.PORT || 5000

import { COOKIE_OPTIONS } from '@/constants/cookie.constants.js'

const startServer = async () => {
  await connectDB()
  await seedAdmin()

  console.log('----------------------------------------')
  console.log(`🚀 Env: ${process.env.NODE_ENV}`)
  console.log(`🚀 Render: ${process.env.RENDER}`)
  console.log(`🚀 Cookie Options:`, COOKIE_OPTIONS)
  console.log('----------------------------------------')

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
  })
}

startServer()
