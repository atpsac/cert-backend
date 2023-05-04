import UserModel, { UserModelData } from './user.model';
import RoleModel, { RoleModelData } from 'src/roles/role.model';

export interface UserWithRolesModelData extends UserModelData {
    roles: RoleModelData[];
  }
  class UserWithRolesModel extends UserModel {
    roles: RoleModel[];
    constructor(userData: UserWithRolesModelData) {
      super(userData);
      this.roles = userData.roles.map((roleData) => {
        return new RoleModel(roleData);
      });
    }
  }

export default UserWithRolesModel;