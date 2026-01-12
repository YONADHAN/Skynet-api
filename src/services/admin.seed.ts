import bcrypt from 'bcrypt'
import { UserModel } from '@/models/auth/user.model.js'

export const seedAdmin = async () => {
  try {
    const adminEmail = 'varghese@gmail.com'

    const existingAdmin = await UserModel.findOne({ email: adminEmail })

    if (existingAdmin) {
      console.log('ℹ️ Admin already exists, skipping seed')
      return
    }

    const hashedPassword = await bcrypt.hash('Varghese@123', 10)

    await UserModel.create({
      name: 'Varghese',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
    })

    console.log('✅ Admin user created successfully')
  } catch (error) {
    console.error('❌ Failed to seed admin', error)
  }
}
