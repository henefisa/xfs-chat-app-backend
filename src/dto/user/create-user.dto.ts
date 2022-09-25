import { IsString } from "class-validator";
import { IsNotBlank } from "src/decorators";

export class CreateUserDto {

  @IsString()
  @IsNotBlank()
  userName : string;

  @IsString()
  @IsNotBlank()
  email: string;

  @IsString()
  @IsNotBlank()
  password: string;

  @IsString()
  @IsNotBlank()
  fullName: string;

  @IsString()
  avatar: string;

  @IsString()
  @IsNotBlank()
  phone: string;
}
