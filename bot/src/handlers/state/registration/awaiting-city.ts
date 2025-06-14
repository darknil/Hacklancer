import { Context } from 'grammy'
import { UserStateHandler } from '../../../Interfaces/IUserStateHandler'
import { UserRepository } from '../../../repositories/user.repository'
import { STATES } from '../../../constants/states'
import { MESSAGES } from '../../../constants/messages'
import { RoleService } from '../../../services/role.service'
import { RoleRepository } from '../../../repositories/role.repository'
import { ExternalRoleService } from '../../../external/external-role.service'
import { UserService } from '../../../services/user.service'

export class AwaitingCityState implements UserStateHandler {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleService: RoleService,
    private readonly userService: UserService
  ) {}

  async handle(ctx: Context): Promise<void> {
    const userId = ctx.from?.id
    if (!userId) return

    const user = await this.userService.find(userId)
    if (!user) return
    const lang =
      (user.language_code ?? 'en').toLowerCase() === 'ru' ? 'ru' : 'en'

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
