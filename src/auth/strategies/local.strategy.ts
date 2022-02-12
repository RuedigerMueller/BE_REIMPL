import { ConsoleLogger, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { ReadUserDto } from 'src/users/dto/read-user.dto';
import { consoleLoggerOptions } from '../../config/logLevelConfig';
import { AuthService } from '../auth.service';


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new ConsoleLogger(LocalStrategy.name, consoleLoggerOptions);
  
  constructor(private authService: AuthService) {
    super();
  }

  // Routes protect with this strategy must provide include username & password
  // Request object will be enriched with a full user in case of successful validation
  async validate(username: string, password: string): Promise<ReadUserDto> {
    this.logger.log(`validate: username = ${username}`);

    const user: ReadUserDto = await this.authService.validateUser(
      username,
      password,
    );
    if (!user) {
      this.logger.warn(`user not valid`);
      throw new UnauthorizedException();
    }
    this.logger.log(`user validation successful`);
    return user;
  }
}
