import { IsString, IsUUID, IsOptional } from 'class-validator';

export class CountMessageDto {
  @IsString()
  @IsUUID()
  @IsOptional()
  conversationId?: string;
}
