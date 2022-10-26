import { IsOptional, IsUUID } from 'class-validator';
import { IsNotBlank } from 'src/decorators';

export class FriendRequestDto {
	@IsUUID()
	@IsNotBlank()
	@IsOptional()
	userTarget: string;
}
