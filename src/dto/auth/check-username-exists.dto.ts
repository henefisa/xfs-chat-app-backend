import { IsOptional, IsString } from 'class-validator';

export class CheckUsernameExistsDto {
	@IsString()
	@IsOptional()
	username: string;
}
