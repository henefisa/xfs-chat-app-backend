import { IsString } from 'class-validator';
import { IsNotBlank } from 'src/decorators';

export class UpdateProfileUserDto {
  @IsString()
  @IsNotBlank()
  username: string;

  @IsString()
  full_name: string;

  @IsNotBlank()
  @IsString()
  avatar: string;

  @IsNotBlank()
  @IsString()
  email: string;

  @IsString()
  @IsNotBlank()
  phone: string;

  @IsString()
  password: string;
}
