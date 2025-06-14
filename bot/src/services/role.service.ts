import { RoleRepository } from '../repositories/role.repository'
import { ExternalRoleService } from '../external/external-role.service'
import { RoleData } from '../types/role-data.type'

export class RoleService {
  constructor(
    private roleRepository: RoleRepository,
    private externalRoleService: ExternalRoleService
  ) {}

  async findRole(roleUuid: string): Promise<RoleData | null> {
    const cachedRole = await this.roleRepository.get(String(roleUuid))
    if (cachedRole) {
      return cachedRole
    }

    const externalRoles = await this.externalRoleService.fetchUserRoles()
    if (externalRoles) {
      externalRoles.map(async (role) => {
        this.roleRepository.save(role.uuid, role)
      })
      const foundRole = externalRoles.find((role) => role.uuid === roleUuid)
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
        this.roleRepository.save(role.uuid, role)
      })
      // console.log('externalRoles :', externalRoles)
      console.log('roles lenght:', externalRoles.length)
      return externalRoles
    }

    return []
  }
}
