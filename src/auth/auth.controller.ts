import { Controller, Get, Post, Body, UseGuards, Req, Headers, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IncomingHttpHeaders } from 'http';

import { AuthService } from './auth.service';
import { Request } from 'express';
import { RawHeaders, GetUser, Auth } from './decorators';
import { RoleProtected } from './decorators/role-protected.decorator';

import { CreateUserDto, LoginUserDto } from './dto';
import UserModel from '../users/user.model';
import { UserRoleGuard } from './guards/user-role.guard';
import { ValidRoles } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('logout')
  @UseGuards(AuthGuard('jwt-access-token'))
  logout(@GetUser('id') userid: number,) {
    this.authService.logout(userid);
  }

  @Get('refresh')
  @UseGuards(AuthGuard('jwt-refresh-token'))
  refreshTokens(@Req() req: Express.Request) {
    const userId = req.user['userid'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }

  // @Get('check-status')
  // @Auth()
  // checkAuthStatus(
  //   @GetUser() user: UserModel
  // ) {
  //   return this.authService.checkAuthStatus(user);
  // }


  @Get('private')
  @UseGuards(AuthGuard('jwt-access-token'))
  testingPrivateRoute(
    @Req() request: Express.Request,
    @GetUser() user: UserModel,
    @GetUser('username') username: string,

    @RawHeaders() rawHeaders: string[],
    @Headers() headers: IncomingHttpHeaders,
  ) {


    return {
      ok: true,
      message: 'Hola Mundo Private',
      user,
      username,
      rawHeaders,
      headers
    }
  }


  // @SetMetadata('roles', ['admin','super-user'])

  @Get('private2')
  @RoleProtected(ValidRoles.admin)
  @UseGuards(AuthGuard('jwt-access-token'), UserRoleGuard)
  privateRoute2(
    @GetUser() user: UserModel
  ) {

    return {
      ok: true,
      user
    }
  }


  @Get('private3')
  @Auth(ValidRoles.technician)
  privateRoute3(
    @GetUser() user: string
  ) {

    return {
      ok: true,
      user
    }
  }



}
