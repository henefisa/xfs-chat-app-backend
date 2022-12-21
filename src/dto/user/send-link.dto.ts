import { IsString } from 'class-validator';

export class SendLinkDto {
  @IsString()
  email: string;
}
