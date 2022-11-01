import { IsString } from 'class-validator';

export class CheckUsernameExistsDto {
  @IsString()
  username: string;
}
