import { IsUUID } from 'class-validator';
import { IsNotBlank } from 'src/decorators';

export class OfferToCallDto {
  @IsUUID()
  @IsNotBlank()
  ownerId: string;

  @IsUUID()
  @IsNotBlank()
  userTargetId: string;

  @IsUUID()
  @IsNotBlank()
  conversationId: string;
}
