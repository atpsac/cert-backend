import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import UsersService from 'src/users/users.service'; '../../users/users.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy( Strategy, 'jwt-access-token' ) {

    constructor(
        private readonly usersService: UsersService,
        configService: ConfigService
    ) {

        super({
            secretOrKey: configService.get('JWT_ACCESS_TOKEN_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }


    async validate( payload: JwtPayload ) {
        
        const { username } = payload;

        // TO-DO: Get a RAW data    
        const user = await this.usersService.findByUsernameWithRoles(username);

        if ( !user ) 
            throw new UnauthorizedException('Token not valid')
            
        if ( !user.situation ) 
            throw new UnauthorizedException('User is inactive, talk with an admin');        

        return user;
    }

}