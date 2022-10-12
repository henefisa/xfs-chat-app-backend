import { EUserRole } from './../interfaces/user.interface';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../shares';
import { EUserStatus } from 'src/interfaces/user.interface';

@Entity('users')
export class User extends BaseEntity {
  @Column()
  username: string;

  @Column({ nullable: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ nullable: true })
  full_name: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ enum: EUserStatus, default: EUserStatus.Inactive })
  status: EUserStatus;

  @Column({ enum: EUserRole, default: EUserRole.USER })
  role: EUserRole;
}
