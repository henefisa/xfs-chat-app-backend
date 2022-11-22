import { IsString } from 'class-validator';
import { IsNotBlank } from 'src/decorators';

export class addParticipantDto {
  @IsString()
  @IsNotBlank()
  userTarget: string;
}
