import { Exclude } from 'class-transformer';
import {ValidRoles} from '../interfaces/valid-roles'

export type UserModelData = {
  id: number;
  username: string;
  email: string;
  password: string;
  roles: ValidRoles[]; 
};
class UserModel {
  id: number;
  username: string;
  email: string;
  @Exclude()
  password: string;
  roles: ValidRoles[];

  constructor(data: UserModelData) {
    this.id = data.id;
    this.username = data.username;
    this.email = data.email;
    this.password = data.password;
    this.roles = data.roles;
  }
}

export default UserModel;
