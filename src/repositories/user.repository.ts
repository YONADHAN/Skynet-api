import { IUser, UserModel } from '@/models/auth/user.model.js'

export class UserRepository {
  // ----------------- CREATE USER -----------------
  async createUser(data: Partial<IUser>): Promise<IUser> {
    try {
      const user = new UserModel(data)
      return await user.save()
    } catch (error: any) {
      throw new Error(`Failed to create user: ${error.message}`)
    }
  }

  // ----------------- FIND BY EMAIL -----------------
  async findByEmail(email: string): Promise<IUser | null> {
    try {
      return await UserModel.findOne({ email })
    } catch (error: any) {
      throw new Error(`Failed to find user by email: ${error.message}`)
    }
  }

  // ----------------- FIND BY ID -----------------
  async findById(id: string): Promise<IUser | null> {
    try {
      return await UserModel.findById(id)
    } catch (error: any) {
      throw new Error(`Failed to find user by id: ${error.message}`)
    }
  }
}
