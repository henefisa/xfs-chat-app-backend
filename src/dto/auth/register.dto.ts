import { IsString } from 'class-validator';
import { IsNotBlank } from 'src/decorators';
import { IsNotExists } from 'src/decorators/is-not-exists.decorator';
import { checkUsernameExists } from 'src/services/user.service';

export class RegisterDto {
  @IsString()
  @IsNotBlank()
  @IsNotExists(checkUsernameExists)
  username: string;

  @IsString()
  @IsNotBlank()
  password: string;
}
