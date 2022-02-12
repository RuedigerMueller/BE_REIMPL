import { ConsoleLogger, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { consoleLoggerOptions } from '../config/logLevelConfig';
import { ReadUserDto } from '../users/dto/read-user.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  private readonly logger = new ConsoleLogger(UsersService.name, consoleLoggerOptions);
  
  constructor(
    private usersService: UsersService, 
    private jwtService: JwtService
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<ReadUserDto | undefined> {
    this.logger.log(`validateUser: username = ${username}`);
    return this.usersService.validateUser(username, password);
  }

  async login(user: ReadUserDto) {
    this.logger.log(`login: user = ${user}`);
    const payload = { 
      sub: user.id,
      username: user.username, 
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    };
    return {
      access_token: this.jwtService.sign(payload),
    }
  }
}
