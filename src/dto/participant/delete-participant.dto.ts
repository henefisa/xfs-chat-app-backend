import { IsString, IsUUID } from 'class-validator';

export class DeleteParticipantDto {
  @IsString()
  @IsUUID()
  userId: string;
}
