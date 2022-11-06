import { EUserStatus } from 'src/interfaces/user.interface';
import { IsEnum } from 'class-validator';

export class ActivateDto {
  @IsEnum(EUserStatus)
  status: EUserStatus;
}
