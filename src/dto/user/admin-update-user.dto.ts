import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { EUserRole, EUserActiveStatus } from 'src/interfaces';
export class AdminUpdateUserDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEnum(EUserRole)
  @IsOptional()
  role?: string;

  @IsEnum(EUserActiveStatus)
  @IsOptional()
  activeStatus?: string;
}
