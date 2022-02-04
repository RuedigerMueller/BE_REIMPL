import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { ReadUserDto } from './dto/read-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ReadUserDto | undefined> {
    try {
      return await this.usersService.create(createUserDto);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  findAll(): Promise<ReadUserDto[]> {
    return this.usersService.findAll();
  }

  @Get('email')
  findByEmail(@Query('email') email: string): Promise<ReadUserDto | undefined> {
    return this.usersService.findByEmail(email);
  }

  @Get(':id')
  async findByID(@Param('id') id: string): Promise<ReadUserDto | undefined> {
    try {
      return await this.usersService.findByID(+id);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.NOT_FOUND);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ReadUserDto> {
    const user: ReadUserDto = await this.usersService.update(
      +id,
      updateUserDto,
    );
    if (user != undefined) {
      return user;
    } else {
      throw new HttpException('No user to update', HttpStatus.NO_CONTENT);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    try {
      return await this.usersService.remove(+id);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.NO_CONTENT);
    }
  }
}
