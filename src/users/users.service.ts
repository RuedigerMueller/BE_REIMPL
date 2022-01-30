import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  create(createUserDto: CreateUserDto): User {
    return new User();
  }

  findAll(): ReadonlyArray<User> {
    let result: ReadonlyArray<User> = [];
    return result;
  }

  findOne(id: number): User {
    return new User();
  }

  update(id: number, updateUserDto: UpdateUserDto): User {
    return new User();
  }

  remove(id: number): void {
    return;
  }
}
