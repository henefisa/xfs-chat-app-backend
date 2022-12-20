import { EEmotionType } from 'src/interfaces/emotion.interface';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { IsNotBlank } from 'src/decorators';

export class expressFeelingDto {
  @IsUUID()
  @IsNotBlank()
  @IsOptional()
  messageId: string;

  @IsEnum(EEmotionType)
  @IsOptional()
  type: string;
}
