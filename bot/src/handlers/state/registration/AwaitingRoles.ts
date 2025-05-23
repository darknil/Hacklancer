import { Context } from 'grammy'
import { UserStateHandler } from '../../../Interfaces/IUserStateHandler'
import { UserRepository } from '../../../repositories/UserRepository'
import { STATES } from '../../../constants/states'
import { MESSAGES } from '../../../constants/messages'
import { RoleService } from '../../../services/role.service'
import { RoleRepository } from '../../../repositories/RoleRepository'
import { ExternalRoleService } from '../../../external/ExternalRoleService'

export class AwaitingRolesState implements UserStateHandler {
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
    if (!ctx.pollAnswer?.user?.id) return
    const userId = ctx.pollAnswer?.user?.id
    const userLang = ctx.pollAnswer?.user?.language_code

    const lang = userLang === 'ru' ? 'ru' : 'en'
    const roles = await this.roleService.getAllRoles()
    const sortedRoles = roles.sort((a, b) => {
      const aId = a.numericId || 0
      const bId = b.numericId || 0
      return aId - bId
    })
    const selectedRoles = ctx.pollAnswer.option_ids.map((i) => sortedRoles[i])
    const roleNames = selectedRoles.map((role) => role.name)

    this.userRepository.update(userId, {
      roleId: selectedRoles[0].id,
      state: STATES.REGISTRATION.AWAITING_CITY
    })
    console.log(selectedRoles[0])
    await ctx.api.sendMessage(
      ctx.pollAnswer.user.id,
      MESSAGES[lang].registration.sendPhoto
    )
  }
}
