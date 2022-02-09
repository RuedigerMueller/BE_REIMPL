import { Injectable } from '@nestjs/common';
import { ReadUserDto } from '../users/dto/read-user.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<ReadUserDto | undefined> {
    return this.usersService.validateUser(username, password);
  }
}
