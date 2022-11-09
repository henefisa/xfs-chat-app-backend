import { IsOptional, IsString } from 'class-validator';
import { IsNotBlank } from 'src/decorators';

export class sendMessageDto {
  @IsString()
  @IsOptional()
  message: string;

  @IsString()
  @IsNotBlank()
  conversation: string;
}
