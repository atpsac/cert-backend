import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { UsersModule } from 'src/users/users.module';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
  imports: [
    UsersModule,
    ConfigModule,
    PassportModule,
    // PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({})

    // JwtModule.registerAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: async (configService: ConfigService) => ({
    //     // console.log('JWT Secret', configService.get('JWT_SECRET') )
    //     // console.log('JWT SECRET', process.env.JWT_SECRET)
    //       secret: configService.get('JWT_ACCESS_TOKEN_SECRET'),
    //       signOptions: {
    //         expiresIn: `${configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}s`
    //     }
    //   })
    // })


    // JwtModule.register({
    // secret: process.env.JWT_SECRET,
    // signOptions: {
    //   expiresIn:'2h'
    // }
    // })

  ],
  exports: [AccessTokenStrategy, PassportModule, JwtModule]
})
export class AuthModule { }
