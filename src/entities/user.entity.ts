import { EUserRole } from 'src/interfaces/user.interface';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from 'src/shares';
import { EUserStatus, EUserActiveStatus } from 'src/interfaces/user.interface';
@Entity('users')
export class User extends BaseEntity {
  @Column()
  username: string;

  @Column({ nullable: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ nullable: true, name: 'full_name' })
  fullName: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  location: string;

  @Column({
    nullable: true,
    default: EUserActiveStatus.OFFLINE,
    name: 'user_active_status',
  })
  activeStatus: EUserActiveStatus;

  @Column({ enum: EUserStatus, default: EUserStatus.Inactive })
  status: EUserStatus;

  @Column({ enum: EUserRole, default: EUserRole.USER })
  role: EUserRole;
}
