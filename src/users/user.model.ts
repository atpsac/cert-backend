// import { Exclude } from 'class-transformer';
// import {ValidRoles} from '../auth/interfaces/valid-roles'

export type UserModelData = {
  id: number;
  username: string;
  password: string;
  refreshtoken: string;
  create_user: number;
  create_date: string;
  update_user: number;
  update_date: string;
  situation: boolean;
};
class UserModel {
  id: number;
  username: string;
  password: string;
  refreshtoken: string
  createUser: number;
  createDate: string;
  updateUser: number;
  updateDate: string;
  situation: boolean;

  constructor(data: UserModelData) {
    this.id = data.id;
    this.username = data.username;
    this.password = data.password;
    this.refreshtoken = data.refreshtoken;
    this.createUser = data.create_user;
    this.createDate = data.create_date;
    this.updateUser = data.update_user;
    this.updateDate = data.update_date;
    this.situation = data.situation;
  }
}

export default UserModel;
