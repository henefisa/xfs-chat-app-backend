import { IsEmail, IsString } from 'class-validator';

export class OtpDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  otp: string;
}
