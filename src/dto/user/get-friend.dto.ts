import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetUserFriendDto {
	@IsString()
	@IsOptional()
	owner: string;

	@IsNumber()
	@IsOptional()
	@Type(() => Number)
	limit?: number;

	@IsNumber()
	@IsOptional()
	@Type(() => Number)
	offset?: number;
}
