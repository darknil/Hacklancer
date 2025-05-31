import axios from 'axios'
import { RoleData } from '../types/RoleData'

export class ExternalRoleService {
  private baseUrl: string

  constructor() {
    this.baseUrl = `http://${process.env.ROLE_SERVICE_HOST}:3000`
  }
  async fetchUserRoles(): Promise<RoleData[] | null> {
    try {
      const res = await axios.get(`${this.baseUrl}/roles`)

      const rolesWithNumericId = res.data.map((role: any, index: number) => ({
        id: role.id,
        numericId: index + 1,
        name: role.name
      }))
      return rolesWithNumericId
    } catch (err) {
      return null
    }
  }
}
