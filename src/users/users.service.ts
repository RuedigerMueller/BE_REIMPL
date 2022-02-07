import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
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
  ) {}

  async create(createUserDto: CreateUserDto): Promise<ReadUserDto> | undefined {
    const userWithoutPassword: CreateUserDto = {
      email: createUserDto.email,
      password: '*',
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      username: createUserDto.username,
    };
    this.logger.log(`createUserDto = ${JSON.stringify(userWithoutPassword)}`);

    // check if all required data was provided
    await this.checkCreateDataValid(createUserDto);

    try {
      const user: User = await this.usersRepository.save(createUserDto);
      if (user !== undefined) {
        const foundUser: ReadUserDto = {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
        };
        return Promise.resolve(foundUser);
      }
    } catch {
      this.logger.log('User creation failed');
      throw new Error(`User creation failed`);
    }
  }

  private async checkCreateDataValid(createUserDto: CreateUserDto) {
    if (
      createUserDto.username === '' ||
      createUserDto.password === '' ||
      createUserDto.firstName === '' ||
      createUserDto.lastName === '' ||
      createUserDto.email === ''
    ) {
      this.logger.warn(`User data incomplete`);
      throw new Error(`User data incomplet`);
    }

    let eMailAvailable = false;
    try {
      await this.findByEmail(createUserDto.email);
      eMailAvailable = false;
    } catch {
      eMailAvailable = true;
    }

    if (eMailAvailable === false) {
      this.logger.warn(`User e-mail already taken`);
      throw new Error(`User e-mail already taken`);
    }
  }

  async findAll(): Promise<ReadUserDto[]> {
    this.logger.log(`findAll`);
    const user: User[] = await this.usersRepository.find();
    let result: ReadUserDto[] = [];
    user.forEach((user) => {
      const readUserDto: ReadUserDto = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
      };
      result = result.concat(readUserDto);
    });
    return Promise.resolve(result);
  }

  async findByID(id: number): Promise<ReadUserDto | undefined> {
    this.logger.log(`findOne: id = ${id}`);
    const user: User = await this.usersRepository.findOne({
      where: { id: id },
    });

    if (user !== undefined) {
      const foundUser: ReadUserDto = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
      };
      return Promise.resolve(foundUser);
    } else {
      this.logger.log(`User with id = ${id} not found`);
      throw new Error(`User with id = ${id} not found`);
    }
  }

  async findByEmail(email: string): Promise<ReadUserDto | undefined> {
    this.logger.log(`findByEMail: email = ${email}`);
    const user: User = await this.usersRepository.findOne({
      where: { email: email },
    });

    if (user !== undefined) {
      const foundUser: ReadUserDto = {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      };
      return Promise.resolve(foundUser);
    } else {
      this.logger.log(`User with email = ${email} not found`);
      throw new Error(`User with email = ${email} not found`);
    }
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<ReadUserDto | undefined> {
    const userWithoutPassword: UpdateUserDto = {
      ...updateUserDto,
      password: '*',
    };
    this.logger.log(
      `update: id = ${id}, updateUserDto = ${JSON.stringify(
        userWithoutPassword,
      )} `,
    );

    const user: User = await this.usersRepository.findOne({
      where: { id: id },
    });

    if (user !== undefined) {
      const result = await this.usersRepository.save({
        ...user, // existing fields
        ...updateUserDto, // updated fields
      });
      const updatedUser: ReadUserDto = {
        id: result.id,
        email: result.email,
        firstName: result.firstName,
        lastName: result.lastName,
        username: result.username,
      };
      return Promise.resolve(updatedUser);
    } else {
      this.logger.log(
        `Update not executed as user with id ${id} does not exist`,
      );
      throw new Error(
        `Update not executed as user with id ${id} does not exist`,
      );
    }
  }

  async remove(id: number): Promise<void> {
    this.logger.log(`remove: id = ${id}`);

    const result: DeleteResult = await this.usersRepository.delete(id);
    if (result.affected === 1) {
      return Promise.resolve(undefined);
    } else {
      this.logger.log(`User with ID ${id} was not deleted`);
      throw new Error(`User with ID ${id} was not deleted`);
    }
  }
}
