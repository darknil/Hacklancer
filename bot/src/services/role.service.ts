import { RoleRepository } from '../repositories/RoleRepository'
import { ExternalRoleService } from '../external/ExternalRoleService'
import { RoleData } from '../types/RoleData'

export class RoleService {
  constructor(
    private roleRepository: RoleRepository,
    private externalRoleService: ExternalRoleService
  ) {}

  async findRole(roleId: string): Promise<RoleData | null> {
    const cachedRole = await this.roleRepository.get(String(roleId))
    if (cachedRole) {
      return cachedRole
    }

    const externalRoles = await this.externalRoleService.fetchUserRoles()
    if (externalRoles) {
      externalRoles.map(async (role) => {
        this.roleRepository.save(role.id, role)
      })
      const foundRole = externalRoles.find((role) => role.id === roleId)
      return foundRole || null
    }

    return null
  }
  async getAllRoles(): Promise<RoleData[]> {
    const cachedRoles = await this.roleRepository.getAllRoles()
    if (cachedRoles.length > 0) {
      return cachedRoles
    }

    const externalRoles = await this.externalRoleService.fetchUserRoles()
    if (externalRoles) {
      externalRoles.map(async (role) => {
        this.roleRepository.save(role.id, role)
      })
      // console.log('externalRoles :', externalRoles)
      console.log('roles lenght:', externalRoles.length)
      return externalRoles
    }

    return []
  }
}
