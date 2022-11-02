import { EMessageStatus } from 'src/interfaces/message.interface';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetMessageDto {
  @IsString()
  @IsOptional()
  q?: string;

  @IsEnum(EMessageStatus)
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
