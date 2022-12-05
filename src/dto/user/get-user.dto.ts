import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';
import { EUserFriendRequestStatus } from 'src/interfaces/user-friend.interface';
import { EUserStatus } from 'src/interfaces/user.interface';

export class GetUserDto {
  @IsString()
  @IsOptional()
  q?: string;

  @IsEnum(EUserFriendRequestStatus)
  @IsOptional()
  friendStatus?: string;

  @IsEnum(EUserStatus)
  @IsOptional()
  status?: string;

  @IsNumberString()
  @IsOptional()
  limit?: number;

  @IsNumberString()
  @IsOptional()
  offset?: number;
}
