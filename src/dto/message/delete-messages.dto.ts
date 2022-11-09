import { IsString } from 'class-validator';

export class deleteMessageDto {
  @IsString()
  messageId: string;
}
