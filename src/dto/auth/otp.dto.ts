import { IsString } from 'class-validator';

export class OtpDto {
  @IsString()
  otp: string;
}
