import { ConsoleLogger, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ReadUserDto } from 'src/users/dto/read-user.dto';
import { consoleLoggerOptions } from '../../config/logLevelConfig';
import { jwtConfiguration } from '../configuration/authConfiguration';
import { LocalStrategy } from './local.strategy';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    private readonly logger = new ConsoleLogger(LocalStrategy.name, consoleLoggerOptions);
    
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
        this.logger.log(`validate: payload = ${payload}`);
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