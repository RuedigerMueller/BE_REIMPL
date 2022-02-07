import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
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
      throw new BadRequestException(e.message);
    }
  }

  @Get()
  findAll(): Promise<ReadUserDto[]> {
    try {
      return this.usersService.findAll();  
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Get('email')
  findByEmail(@Query('email') email: string): Promise<ReadUserDto | undefined> {
    try {
      return this.usersService.findByEmail(email);
    } catch (e) {
      throw new NotFoundException(e.message);
    }
  }

  @Get(':id')
  async findByID(@Param('id') id: string): Promise<ReadUserDto | undefined> {
    try {
      return await this.usersService.findByID(+id);
    } catch (e) {
      throw new NotFoundException(e.message);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ReadUserDto> {
    try {
      return await this.usersService.update(+id, updateUserDto);
    } catch  (e) {
      throw new HttpException(e.message, HttpStatus.NO_CONTENT);
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
