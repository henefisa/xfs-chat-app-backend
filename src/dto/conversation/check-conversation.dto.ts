import { IsOptional, IsUUID } from 'class-validator';

export class CheckConversationDto {
  @IsUUID()
  @IsOptional()
  userTarget: string;
}
