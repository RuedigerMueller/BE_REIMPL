import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { ReadUserDto } from './dto/read-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  create(createUserDto: CreateUserDto): ReadUserDto {
    return new User();
  }

  findAll(): ReadonlyArray<ReadUserDto> {
    let result: ReadonlyArray<ReadUserDto> = [];
    return result;
  }

  findOne(id: number): ReadUserDto {
    return new ReadUserDto();
  }

  update(id: number, updateUserDto: UpdateUserDto): ReadUserDto {
    return new ReadUserDto();
  }

  remove(id: number): void {
    return;
  }
}
