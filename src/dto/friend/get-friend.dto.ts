import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';
import { EUserFriendRequestStatus } from 'src/interfaces/user-friend.interface';

export class GetUserFriendDto {
  @IsString()
  @IsOptional()
  q?: string;

  @IsEnum(EUserFriendRequestStatus)
  @IsOptional()
  status?: string;

  @IsNumberString()
  @IsOptional()
  limit?: number;

  @IsNumberString()
  @IsOptional()
  offset?: number;
}
