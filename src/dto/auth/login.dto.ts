import { IsOptional, IsString } from 'class-validator';

export class LoginDto {
	@IsString()
	@IsOptional()
	username: string;

	@IsString()
	@IsOptional()
	password: string;
}
