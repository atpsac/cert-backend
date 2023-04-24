import { Exclude } from 'class-transformer';
import {ValidRoles} from '../auth/interfaces/valid-roles'

export type UserModelData = {
  id: number;
  username: string;
  password: string;
  isActive: boolean;
  roles: ValidRoles[];
};
class UserModel {
  id: number;
  username: string;
  @Exclude()
  password: string;
  isActive: boolean;
  roles: ValidRoles[];

  constructor(data: UserModelData) {
    this.id = data.id;
    this.username = data.username;
    this.password = data.password;
    this.isActive = data.isActive;
    this.roles = data.roles;
  }
}

export default UserModel;
