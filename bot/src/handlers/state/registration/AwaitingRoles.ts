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
    const roles = await this.roleService.getAllRoles()
    const selectedRoles = ctx.pollAnswer.option_ids.map((i) => roles[i])
    const roleNames = selectedRoles.map((role) => role.name)
    await ctx.api.sendMessage(
      ctx.pollAnswer.user.id,
      `Вы выбрали следующие роли: ${roleNames.join(', ')}`
    )
  }
}
