import { IsString } from 'class-validator';
import { IsNotBlank } from 'src/decorators';

export class CreateUserDto {
  @IsString()
  @IsNotBlank()
  username: string;

  @IsString()
  @IsNotBlank()
  password: string;
}
