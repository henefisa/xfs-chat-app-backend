import { IsString, IsUUID } from 'class-validator';

export class SetAdminDto {
  @IsString()
  @IsUUID()
  userId: string;
}
