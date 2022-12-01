import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class GetConversationDto {
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
