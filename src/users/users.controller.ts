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
  ParseIntPipe,
  Patch,
  Post,
  Query
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
  ): Promise<ReadUserDto> {
    try {
      return await this.usersService.create(createUserDto);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Get()
  async findAll(): Promise<ReadUserDto[]> {
    try {
      return await this.usersService.findAll();  
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Get('byEMail')
  async findByEmail(@Query('email') email: string): Promise<ReadUserDto> {
    try {
      return await this.usersService.findByEmail(email);
    } catch (e) {
      throw new NotFoundException(e.message);
    }
  }

  @Get(':id')
  async findByID(@Param('id', ParseIntPipe) id: number): Promise<ReadUserDto> {
    try {
      return await this.usersService.findByID(id);
    } catch (e) {
      throw new NotFoundException(e.message);
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ReadUserDto> {
    try {
      return await this.usersService.update(id, updateUserDto);
    } catch  (e) {
      throw new HttpException(e.message, HttpStatus.NO_CONTENT);
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    try {
      return await this.usersService.remove(id);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.NO_CONTENT);
    }
  }
}
