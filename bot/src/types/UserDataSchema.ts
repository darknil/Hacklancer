import { z } from 'zod'

export const UserDataSchema = z.object({
  chatId: z.number(),
  username: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  state: z.string().nullable().optional(),
  language_code: z.string().optional(),
  nickname: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  photoURL: z.string().nullable().optional()
})
