import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { ReadUserDto } from './dto/read-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  create(createUserDto: CreateUserDto): ReadUserDto {
    const userWithoutPassword: CreateUserDto = createUserDto;
    userWithoutPassword.password = '*';
    this.logger.log(`create: createUserDto = ${userWithoutPassword}`);
    return new User();
  }

  findAll(): ReadonlyArray<ReadUserDto> {
    this.logger.log(`findAll`);
    let result: ReadonlyArray<ReadUserDto> = [];
    return result;
  }

  findOne(id: number): ReadUserDto {
    this.logger.log(`findOne: id = ${id}`);
    return new ReadUserDto();
  }

  findByEMail(email: string): ReadUserDto {
    this.logger.log(`findByEMail: email = ${email}`);
    return new ReadUserDto();
  }

  update(id: number, updateUserDto: UpdateUserDto): ReadUserDto {
    const userWithoutPassword: UpdateUserDto = updateUserDto;
    userWithoutPassword.password = '*';
    this.logger.log(`update: id = ${id}, updateUserDto = ${userWithoutPassword} `);
    return new ReadUserDto();
  }

  remove(id: number): void {
    this.logger.log(`remove: id = ${id}`);
    return;
  }
}
