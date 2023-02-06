import { IsString } from 'class-validator';
import { IsNotBlank } from 'src/decorators';

export class CreateMessageReadDto {
  @IsString()
  @IsNotBlank()
  conversationId: string;

  @IsString()
  @IsNotBlank()
  userId: string;
}
