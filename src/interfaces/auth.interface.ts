import { EUserRole } from './user.interface';
export interface PayloadToken {
  role: EUserRole;
  sub: string;
}
