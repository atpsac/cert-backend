import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import UserModel from '../users/user.model';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import UsersService from '../users/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto';


@Injectable()
export class AuthService {

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }


  async create(createUserDto: CreateUserDto) {

    try {

      const { password, ...userData } = createUserDto;

      const user = this.usersService.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      });

      return {
        ...user,
        token: this.getJwtToken({ username: (await user).username }),
        message: 'ok'
      };

    } catch (error) {
      this.handleDBErrors(error);
    }

  }

  async login(loginUserDto: LoginUserDto) {

    const { password, username } = loginUserDto;

    const user = await this.usersService.findByUsernameWithRoles(username);

    if (!user)
      throw new UnauthorizedException('Credentials are not valid (username)');

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials are not valid (password)');

    return {
      ...user,
      token: this.getJwtToken({ username: user.username }),
      message: 'ok'
    };
  }

  async checkAuthStatus(user: UserModel) {

    return {
      ...user,
      token: this.getJwtToken({ username: user.username }),
      message: 'ok'
    };

  }

  private getJwtToken(payload: JwtPayload) {

    const token = this.jwtService.sign(payload);
    return token;

  }

  private handleDBErrors(error: any): never {


    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    console.log(error)

    throw new InternalServerErrorException('Please check server logs');

  }


}
