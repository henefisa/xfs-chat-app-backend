import { IsOptional, IsString } from 'class-validator';
import { IsNotBlank } from 'src/decorators';

export class UpdateUserDto {
  @IsString()
  @IsNotBlank()
  username: string;

  @IsString()
  @IsNotBlank()
  password: string;

  @IsString()
  fullName: string;

  @IsOptional()
  @IsString()
  avatar: string;

  @IsString()
  @IsNotBlank()
  phone: string;
}
