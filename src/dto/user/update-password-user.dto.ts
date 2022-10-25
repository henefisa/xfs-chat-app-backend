import { IsString } from 'class-validator';

export class UpdatePasswordUserDto {
  @IsString()
  password: string;
}
