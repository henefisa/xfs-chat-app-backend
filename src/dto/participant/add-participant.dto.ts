import { ArrayNotEmpty, IsArray, IsUUID } from 'class-validator';

export class AddParticipantDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID()
  members: string[];
}
