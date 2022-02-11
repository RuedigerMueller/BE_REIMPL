import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ReadUserDto } from 'src/users/dto/read-user.dto';
import { jwtConfiguration } from '../configuration/authConfiguration';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConfiguration.secret,
        });
    }

    // With JwtStrategy the access token will be decrypted and the request
    // will get enriched with a full user object created from the decrypted
    // JWT token
    async validate(payload: any) {
        const user: ReadUserDto = {
            id: payload.sub,
            username: payload.username,
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email
        }
        return user;
    }
}