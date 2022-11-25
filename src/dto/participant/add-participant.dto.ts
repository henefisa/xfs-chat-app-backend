import { ArrayNotEmpty, IsArray, IsUUID } from 'class-validator';

export class AddParticipantDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID(4, { each: true })
  members: string[];
}
