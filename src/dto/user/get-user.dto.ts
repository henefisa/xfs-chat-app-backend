import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { EUserStatus } from 'src/interfaces/user.interface';

export class GetUserDto {
  @IsString()
  @IsOptional()
  q?: string;

  @IsEnum(EUserStatus)
  @IsOptional()
  status?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset?: number;
}
