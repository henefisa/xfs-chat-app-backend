import { IsString } from 'class-validator';
import { IsNotBlank } from 'src/decorators';

export class GetPreSignedUrlDto {
  @IsString()
  @IsNotBlank()
  key: string;
}
