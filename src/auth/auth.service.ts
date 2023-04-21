import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import UserModel from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import UsersRepository from './auth.repository';
import { CreateUserDto } from './dto/create-user.dto';


@Injectable()
export class AuthService {

  constructor(

    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) { }


  async create(createUserDto: CreateUserDto) {

    try {

      const { password, ...userData } = createUserDto;

      const user = this.usersRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      });

      await this.usersRepository.save(user)
      delete user.password;

      return {
        ...user,
        token: this.getJwtToken({ id: user.id })
      };
      // TODO: Retornar el JWT de acceso

    } catch (error) {
      this.handleDBErrors(error);
    }

  }

  // async login( loginUserDto: LoginUserDto ) {

  //   const { password, email } = loginUserDto;

  //   const user = await this.userRepository.findOne({
  //     where: { email },
  //     select: { email: true, password: true, id: true } //! OJO!
  //   });

  //   if ( !user ) 
  //     throw new UnauthorizedException('Credentials are not valid (email)');

  //   if ( !bcrypt.compareSync( password, user.password ) )
  //     throw new UnauthorizedException('Credentials are not valid (password)');

  //   return {
  //     ...user,
  //     token: this.getJwtToken({ id: user.id })
  //   };
  // }

  // async checkAuthStatus( user: User ){

  //   return {
  //     ...user,
  //     token: this.getJwtToken({ id: user.id })
  //   };

  // }



  // private getJwtToken( payload: JwtPayload ) {

  //   const token = this.jwtService.sign( payload );
  //   return token;

  // }

  // private handleDBErrors( error: any ): never {


  //   if ( error.code === '23505' ) 
  //     throw new BadRequestException( error.detail );

  //   console.log(error)

  //   throw new InternalServerErrorException('Please check server logs');

  // }


}
