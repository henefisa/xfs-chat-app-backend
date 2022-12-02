import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';
import { EUserStatus } from 'src/interfaces/user.interface';

export class GetUserDto {
  @IsString()
  @IsOptional()
  q?: string;

  @IsEnum(EUserStatus)
  @IsOptional()
  status?: string;

  @IsNumberString()
  @IsOptional()
  limit?: number;

  @IsNumberString()
  @IsOptional()
  offset?: number;
}
