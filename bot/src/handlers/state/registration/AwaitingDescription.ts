import { Context } from 'grammy'
import { UserStateHandler } from '../../../Interfaces/IUserStateHandler'
import { MESSAGES } from '../../../constants/messages'
import { UserRepository } from '../../../repositories/UserRepository'
import { STATES } from '../../../constants/states'
import { RoleRepository } from '../../../repositories/RoleRepository'
import { ExternalRoleService } from '../../../external/ExternalRoleService'
import { RoleService } from '../../../services/role.service'

export class AwaitingDescriptionState implements UserStateHandler {
  private userRepository: UserRepository
  private roleService: RoleService

  constructor() {
    this.userRepository = new UserRepository()
    this.roleService = new RoleService(
      new RoleRepository(),
      new ExternalRoleService()
    )
  }
  async handle(ctx: Context): Promise<void> {
    const userId = ctx.from?.id.toString()
    if (!userId) return

    const userLang = ctx.from?.language_code

    const lang = userLang === 'ru' ? 'ru' : 'en'

    const message = ctx.message?.text
    if (typeof message !== 'string') {
      await ctx.reply(MESSAGES[lang].registration.enterDescription)
      return
    }

    this.userRepository.update(userId, {
      description: message,
      state: STATES.REGISTRATION.AWAITING_ROLES
    })

    const roles = await this.roleService.getAllRoles()
    // Сортируем роли по numericId для правильного порядка
    const sortedRoles = roles.sort((a, b) => {
      const aId = a.numericId || 0
      const bId = b.numericId || 0
      return aId - bId
    })
    const options = sortedRoles.map((role) => ({
      text: `${role.numericId || 0}. ${role.name}`
    }))

    await ctx.replyWithPoll(MESSAGES[lang].registration.choseRole, options, {
      is_anonymous: false,
      allows_multiple_answers: false
    })
  }
}
