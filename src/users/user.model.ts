import { Exclude } from 'class-transformer';
import {ValidRoles} from '../auth/interfaces/valid-roles'

export type UserModelData = {
  id: number;
  username: string;
  password: string;
  roles: ValidRoles[];
};
class UserModel {
  id: number;
  username: string;
  @Exclude()
  password: string;
  roles: ValidRoles[];

  constructor(data: UserModelData) {
    this.id = data.id;
    this.username = data.username;
    this.password = data.password;
    this.roles = data.roles;
  }
}

export default UserModel;
