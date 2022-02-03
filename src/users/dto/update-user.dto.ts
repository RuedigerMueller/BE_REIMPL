import { IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
}
