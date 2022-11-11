import { IsOptional, IsString } from 'class-validator';

export class CreateConversationDto {
  @IsString()
  @IsOptional()
  title?: string;
}
