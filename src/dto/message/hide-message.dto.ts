import { IsString } from 'class-validator';

export class hideMessageDto {
  @IsString()
  messageId: string;
}
