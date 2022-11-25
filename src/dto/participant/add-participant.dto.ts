import { ArrayNotEmpty, IsArray } from 'class-validator';
import { IsArrayOfUuid } from 'src/decorators/is-array-of-uuid.decorator';

export class AddParticipantDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsArrayOfUuid()
  members: string[];
}
