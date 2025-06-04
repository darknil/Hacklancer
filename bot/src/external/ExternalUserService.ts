import axios from 'axios'
import { UserData } from '../types/UserData'
import { UserDataSchema } from '../types/UserDataSchema'

export class ExternalUserService {
  private baseUrl: string

  constructor() {
    this.baseUrl = `http://${process.env.USER_SERVICE_HOST}:3000`
  }
  async fetchUserProfile(chatId: number): Promise<UserData | null> {
    try {
      const res = await axios.get(`${this.baseUrl}/users?chatId=${chatId}`)
      const validated = UserDataSchema.safeParse(res.data)

      if (!validated.success) {
        console.error('Validation error:', validated.error)
        return null
      }

      return validated.data
    } catch (err: any) {
      if (err.response?.status === 404) {
        return null
      }
      console.error('❌ Failed to fetch user profile:', err)
      return null
    }
  }

  async createUser(userData: UserData): Promise<UserData | null> {
    console.log('[externalUserService] Creating user:', userData)

    try {
      const response = await axios.post(`${this.baseUrl}/users`, userData)
      return response.data
    } catch (err: any) {
      console.error(
        '❌ Failed to create user via API:',
        err.response?.data || err.message
      )
      return null
    }
  }
  async updateUser(userData: UserData): Promise<void> {
    try {
      const UserUpdateSchema = UserDataSchema.omit({ chatId: true }).strip()
      const validated = UserUpdateSchema.safeParse(userData)
      if (!validated.success) {
        console.error('❌ Invalid user data for update:', validated.error)
        return
      }

      const updateData = Object.fromEntries(
        Object.entries(validated.data).filter(
          ([_, value]) => value !== undefined
        )
      )
      console.log(`[${new Date().toISOString()}] 💾 Saving user:`, updateData)
      await axios.put(
        `${this.baseUrl}/users?chatId=${userData.chatId}`,
        updateData
      )
    } catch (err) {
      console.error('❌ saving user error:', err)
    }
  }
}
