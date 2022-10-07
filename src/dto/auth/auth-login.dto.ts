import { IsOptional, IsString } from 'class-validator';

export class loginDto {
  @IsString()
  @IsOptional()
  username: string;

  @IsString()
  @IsOptional()
  password: string;
}
