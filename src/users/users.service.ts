import { ConsoleLogger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { DeleteResult, Repository } from 'typeorm';
import { consoleLoggerOptions } from '../config/logLevelConfig';
import { Role } from '../roles/entities/role.entity';
import { RoleEnum } from '../roles/roles.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { ReadUserDto } from './dto/read-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { user2readUserDto } from './dto/user.dto.helpers';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly logger = new ConsoleLogger(
    UsersService.name,
    consoleLoggerOptions,
  );

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepostitory: Repository<Role>,
  ) {}

  async create(
    createUserDto: CreateUserDto,
    admin?: boolean,
  ): Promise<ReadUserDto> {
    const { password, ...userWithoutPassword } = createUserDto;
    this.logger.log(`createUserDto = ${JSON.stringify(userWithoutPassword)}`);

    // check if all required data was provided
    await this.checkCreateDataValid(createUserDto);

    // Hash password before storing it on the DB
    const saltOrRounds = 10;
    createUserDto.password = await bcrypt.hash(
      createUserDto.password,
      saltOrRounds,
    );

    try {
      const user: User = await this.usersRepository.save(createUserDto);
      if (user !== undefined) {
        const userRole: Partial<Role> = {
          role: RoleEnum.User,
          user: user,
        };
        await this.roleRepostitory.save(userRole);

        if (admin === true) {
          const adminRole: Partial<Role> = {
            role: RoleEnum.Admin,
            user: user,
          };
          await this.roleRepostitory.save(adminRole);
        }

        const readUserDto: ReadUserDto = await this.findByID(user.id);
        return readUserDto;
      }
    } catch {
      this.logger.error('User creation failed');
      throw new Error(`User creation failed`);
    }
  }

  async validateUser(
    username: string,
    password: string,
  ): Promise<ReadUserDto | undefined> {
    this.logger.log(`validateUser: username = ${username}`);
    const user: User = await this.usersRepository.findOne({
      where: { username: username },
    });
    if (await bcrypt.compare(password, user.password)) {
      this.logger.log(`user validation successful`);
      return user2readUserDto(user);
    } else {
      this.logger.warn(`user validation NOT successful`);
      return undefined;
    }
  }

  async findAll(): Promise<ReadUserDto[]> {
    this.logger.log(`findAll`);
    const user: User[] = await this.usersRepository.find();
    let result: ReadUserDto[] = [];
    user.forEach((user) => {
      const readUserDto: ReadUserDto = user2readUserDto(user);
      result = result.concat(readUserDto);
    });
    return result;
  }

  async findByID(id: number): Promise<ReadUserDto> {
    this.logger.log(`findOne: id = ${id}`);
    const user: User = (await this.usersRepository.findByIds([id]))[0];

    if (user !== undefined) {
      return user2readUserDto(user);
    } else {
      this.logger.error(`User with id = ${id} not found`);
      throw new Error(`User with id = ${id} not found`);
    }
  }

  async findByEmail(email: string): Promise<ReadUserDto> {
    this.logger.log(`findByEMail: email = ${email}`);
    try {
      const user: User = await this.usersRepository.findOne({
        where: { email: email },
      });
      return user2readUserDto(user);
    } catch {
      this.logger.error(`User with email = ${email} not found`);
      throw new Error(`User with email = ${email} not found`);
    }
  }

  async findByUsername(username: string): Promise<ReadUserDto> {
    this.logger.log(`findByUsername: username = ${username}`);
    try {
      const user: User = await this.usersRepository.findOne({
        where: { username: username },
      });
      return user2readUserDto(user);
    } catch {
      this.logger.error(`User with email = ${username} not found`);
      throw new Error(`User with email = ${username} not found`);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<ReadUserDto> {
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
      const resultUser = await this.usersRepository.save({
        ...user, // existing fields
        ...updateUserDto, // updated fields
      });
      return user2readUserDto(resultUser);
    } else {
      this.logger.error(
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
      return undefined;
    } else {
      this.logger.error(`User with ID ${id} was not deleted`);
      throw new Error(`User with ID ${id} was not deleted`);
    }
  }

  private async checkCreateDataValid(
    createUserDto: CreateUserDto,
  ): Promise<void> {
    if (
      createUserDto.username === '' ||
      createUserDto.password === '' ||
      createUserDto.firstName === '' ||
      createUserDto.lastName === '' ||
      createUserDto.email === ''
    ) {
      this.logger.error(`User data incomplete`);
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
      this.logger.error(`User e-mail already taken`);
      throw new Error(`User e-mail already taken`);
    }
  }
}
