import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { EUserFriendRequestStatus } from 'src/interfaces/user-friend.interface';

export class GetUserFriendDto {
  @IsString()
  @IsOptional()
  q?: string;

  @IsEnum(EUserFriendRequestStatus)
  @IsOptional()
  status?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset?: number;
}
