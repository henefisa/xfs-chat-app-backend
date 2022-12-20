import { EEmotionType } from 'src/interfaces/emotion.interface';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { IsNotBlank } from 'src/decorators';

export class ExpressFeelingDto {
  @IsUUID()
  @IsNotBlank()
  @IsOptional()
  messageId: string;

  @IsEnum(EEmotionType)
  @IsOptional()
  type: string;
}
