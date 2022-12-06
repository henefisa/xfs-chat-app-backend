import {
  ENotificationType,
  ENotificationStatus,
} from 'src/interfaces/notification.interface';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { IsNotBlank } from 'src/decorators';

export class SaveNotificationDto {
  @IsUUID()
  @IsNotBlank()
  recipient: string;

  @IsEnum(ENotificationType)
  @IsOptional()
  type?: ENotificationType;

  @IsEnum(ENotificationStatus)
  @IsOptional()
  status?: ENotificationStatus;
}
