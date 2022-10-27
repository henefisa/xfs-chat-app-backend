import { IsOptional, IsString } from 'class-validator';
import { IsNotBlank } from 'src/decorators';

export class UpdateUserDto {
	@IsString()
	@IsNotBlank()
	username: string;

	@IsString()
	fullName: string;

	@IsOptional()
	@IsString()
	avatar: string;

	@IsOptional()
	@IsString()
	email: string;

	@IsString()
	@IsNotBlank()
	phone: string;
}
