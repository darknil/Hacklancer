import { z } from 'zod'

export const UserDataSchema = z.object({
  chatId: z.string().transform((val) => Number(val)),
  username: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  state: z.string().nullable().optional(),
  language_code: z.string().optional()
})
