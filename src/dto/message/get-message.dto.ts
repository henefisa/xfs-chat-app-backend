import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class GetMessageDto {
  @IsString()
  @IsOptional()
  q?: string;

  @IsNumberString()
  @IsOptional()
  limit?: number;

  @IsNumberString()
  @IsOptional()
  offset?: number;
}
