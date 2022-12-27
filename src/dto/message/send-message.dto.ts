import { IsOptional, IsString } from 'class-validator';
import { IsNotBlank } from 'src/decorators';

export class SendMessageDto {
  @IsString()
  @IsNotBlank()
  conversationId: string;

  @IsString()
  @IsNotBlank()
  userId: string;

  @IsString()
  @IsNotBlank()
  text: string;

  @IsString()
  @IsOptional()
  attachment: string;
}
