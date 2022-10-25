import { IsOptional, IsString } from 'class-validator';
import { IsNotBlank } from 'src/decorators';

export class FriendRequestDto {
  @IsString()
  @IsNotBlank()
  @IsOptional()
  users: string;

  @IsString()
  @IsNotBlank()
  @IsOptional()
  owner: string;
}
