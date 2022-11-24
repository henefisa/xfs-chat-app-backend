import { IsArray } from 'class-validator';
import { IAddParticipant } from 'src/interfaces/participant.interface';

export class AddParticipantDto {
  @IsArray()
  members: Array<IAddParticipant>;
}
