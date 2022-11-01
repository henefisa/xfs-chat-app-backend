import { IsString } from 'class-validator';
import { IsNotBlank } from 'src/decorators';

export class RefreshTokenDto {
  @IsString()
  @IsNotBlank()
  refreshToken: string;
}
