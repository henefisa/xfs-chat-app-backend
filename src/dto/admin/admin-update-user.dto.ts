import { IsEnum, IsOptional } from 'class-validator';
import { EUserRole } from 'src/interfaces';
export class AdminUpdateRoleUserDto {
  @IsEnum(EUserRole)
  @IsOptional()
  role?: EUserRole;
}
