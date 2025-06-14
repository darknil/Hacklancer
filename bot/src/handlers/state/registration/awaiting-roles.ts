import { Context } from 'grammy'
import { UserStateHandler } from '../../../Interfaces/IUserStateHandler'
import { UserRepository } from '../../../repositories/user.repository'
import { STATES } from '../../../constants/states'
import { MESSAGES } from '../../../constants/messages'
import { RoleService } from '../../../services/role.service'
import { UserService } from '../../../services/user.service'

export class AwaitingRolesState implements UserStateHandler {
  constructor(
    private userRepository: UserRepository,
    private roleService: RoleService,
    private userService: UserService
  ) {}

  async handle(ctx: Context): Promise<void> {
    if (!ctx.pollAnswer?.user?.id) return
    const userId = ctx.pollAnswer?.user?.id
    const userLang = ctx.pollAnswer?.user?.language_code

    const user = await this.userService.find(userId)
    if (!user) return
    const lang =
      (user.language_code ?? 'en').toLowerCase() === 'ru' ? 'ru' : 'en'

    const roles = await this.roleService.getAllRoles()
    const sortedRoles = roles.sort((a, b) => {
      const aId = a.numericId || 0
      const bId = b.numericId || 0
      return aId - bId
    })
    const selectedRoles = ctx.pollAnswer.option_ids.map((i) => sortedRoles[i])

    this.userRepository.update(userId, {
      roleId: selectedRoles[0].uuid,
      state: STATES.REGISTRATION.AWAITING_DESCRIPTION
    })
    await ctx.api.sendMessage(
      ctx.pollAnswer.user.id,
      MESSAGES[lang].registration.enterDescription
    )
  }
}
