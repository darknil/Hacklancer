import { Context } from 'grammy'
import { UserStateHandler } from '../../../Interfaces/IUserStateHandler'
import { UserRepository } from '../../../repositories/UserRepository'
import { STATES } from '../../../constants/states'
import { MESSAGES } from '../../../constants/messages'
import { RoleService } from '../../../services/role.service'
import { RoleRepository } from '../../../repositories/RoleRepository'
import { ExternalRoleService } from '../../../external/ExternalRoleService'

export class AwaitingCityState implements UserStateHandler {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleService: RoleService
  ) {}

  async handle(ctx: Context): Promise<void> {
    const userId = ctx.from?.id.toString()
    if (!userId) return

    const userLang = ctx.from?.language_code

    const lang = userLang === 'ru' ? 'ru' : 'en'

    const message = ctx.message?.text
    if (typeof message !== 'string') {
      await ctx.reply(MESSAGES[lang].registration.enterCity)
      return
    }

    // ================ send poll ================
    const roles = await this.roleService.getAllRoles()
    const sortedRoles = roles.sort((a, b) => {
      const aId = a.numericId || 0
      const bId = b.numericId || 0
      return aId - bId
    })
    const options = sortedRoles.map((role) => ({
      text: `${role.numericId || 0}. ${role.name}`
    }))
    this.userRepository.update(userId, {
      city: message,
      state: STATES.REGISTRATION.AWAITING_ROLES
    })
    await ctx.replyWithPoll(MESSAGES[lang].registration.choseRole, options, {
      is_anonymous: false,
      allows_multiple_answers: false
    })
    // ================ send poll ================
  }
}
