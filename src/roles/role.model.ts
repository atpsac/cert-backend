import { Exclude } from 'class-transformer';
// import {ValidRoles} from '../auth/interfaces/valid-roles'

export type RoleModelData = {
  id: number;
  rolename: string;
};
class RoleModel {
  id: number;
  rolename: string;


  constructor(data: RoleModelData) {
    this.id = data.id;
    this.rolename = data.rolename;
 
  }
}

export default RoleModel;
