import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { ReadUserDto } from 'src/users/dto/read-user.dto';
import { AuthService } from '../auth.service';


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  // Routes protect with this strategy must provide include username & password
  // Request object will be enriched with a full user in case of successful validation
  async validate(username: string, password: string): Promise<ReadUserDto> {
    const user: ReadUserDto = await this.authService.validateUser(
      username,
      password,
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
