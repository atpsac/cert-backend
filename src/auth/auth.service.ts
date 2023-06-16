import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { JwtPayload } from './interfaces/jwt-payload.interface';
import UsersService from '../users/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) { }


  async create(createUserDto: CreateUserDto) {

    try {

      const { password, ...userData } = createUserDto;

      const user = await this.usersService.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      });

      const tokens = await this.getJwtToken({ userid: user.id, username: user.username });
      await this.updateRefreshToken(user.id, tokens.refreshToken);

      return {
        ...user,
        tokens,
        message: 'ok'
      }

      // return {
      //   ...user,
      //   token: this.getJwtToken({ userid: (await user).id, username: (await user).username }),
      //   message: 'ok'
      // };

    } catch (error) {
      this.handleDBErrors(error);
    }

  }

  async login(loginUserDto: LoginUserDto) {

    const { password, username } = loginUserDto;

    const user = await this.usersService.findByUsernameWithRoles(username);

    // if (!user)
    //   throw new UnauthorizedException('Credentials are not valid (username)');

    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Credentials are not valid (password)');
    }

    const tokens = await this.getJwtToken({ userid: user.id, username: user.username });
    console.log(tokens);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return {
      ...user,
      tokens,
      message: 'ok'
    }

    // return {
    //   ...user,
    //   token: this.getJwtToken({ userid: user.id, username: user.username }),
    //   message: 'ok'
    // };
  }

  async logout(userid: number) {
    return this.usersService.updateRefreshToken(userid, { refreshtoken: null });
  }

  async refreshTokens(userid: number, refreshToken: string) {
    const user = await this.usersService.getById(userid);
    if (!user || !user.refreshtoken)
      throw new ForbiddenException('Access denied (user or token not found)');

    const refreshTokenMatches = await bcrypt.compare(refreshToken, user.refreshtoken);
    if (!refreshTokenMatches) throw new ForbiddenException('Access denied (refresh token not match)');

    const tokens = await this.getJwtToken({ userid: user.id, username: user.username });
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;

  }

  async updateRefreshToken(userid: number, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hashSync(refreshToken, 10);
    await this.usersService.updateRefreshToken(userid, {
      refreshtoken: hashedRefreshToken
    });
  }

  async getJwtToken(payload: JwtPayload) {

    // const token = this.jwtService.signAsync(payload);
    // return token;

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          userid: payload.userid,
          username: payload.username
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
          expiresIn: '1m'
        }
      ),
      this.jwtService.signAsync(
        {
          userid: payload.userid,
          username: payload.username
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
          expiresIn: '3m'
        }
      )
    ]);

    return {
      accessToken,
      refreshToken
    };

  }

  private handleDBErrors(error: any): never {


    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    console.log(error)

    throw new InternalServerErrorException('Please check server logs');

  }

}
