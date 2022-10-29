import { IsOptional, IsUUID } from 'class-validator';
import { IsNotBlank } from 'src/decorators';

export class FriendRequestApproveDto {
  @IsUUID()
  @IsNotBlank()
  @IsOptional()
  userTarget: string;
}
