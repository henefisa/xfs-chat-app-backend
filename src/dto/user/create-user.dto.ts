import { IsOptional, IsString } from "class-validator";
import { IsNotBlank } from "src/decorators";

export class CreateUserDto {
  @IsString()
  @IsNotBlank()
  username: string;

  @IsString()
  @IsNotBlank()
  email: string;

  @IsString()
  @IsNotBlank()
  password: string;

  @IsString()
  fullName: string;

  @IsOptional()
  avatar: string;

  @IsString()
  @IsNotBlank()
  phone: string;
}
