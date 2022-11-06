import { IsString } from 'class-validator';
import { IsNotBlank } from 'src/decorators';

export class LogoutDto {
  @IsString()
  @IsNotBlank()
  refreshToken: string;
}
