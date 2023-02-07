import { IsString } from 'class-validator';
import { IsNotBlank } from 'src/decorators';

export class CreateUserViewedDto {
  @IsString()
  @IsNotBlank()
  conversationId: string;

  @IsString()
  @IsNotBlank()
  userId: string;
}
