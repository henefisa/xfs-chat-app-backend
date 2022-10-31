import { IsString } from 'class-validator';

export class CheckEmailExistsDto {
  @IsString()
  email: string;
}
