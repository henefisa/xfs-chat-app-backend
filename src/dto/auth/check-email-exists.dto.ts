import { IsOptional, IsString } from 'class-validator';

export class CheckEmailExistsDto {
  @IsString()
  @IsOptional()
  email: string;
}
