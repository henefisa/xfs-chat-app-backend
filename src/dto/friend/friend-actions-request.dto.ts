import { IsOptional, IsUUID } from 'class-validator';
import { IsNotBlank } from 'src/decorators';

export class FriendActionDto {
  @IsUUID()
  @IsNotBlank()
  @IsOptional()
  userTarget: string;
}
