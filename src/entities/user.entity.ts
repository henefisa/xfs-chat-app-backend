import { EUserRole } from 'src/interfaces/user.interface';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from 'src/shares';
import { EUserStatus, EUserActiveStatus } from 'src/interfaces/user.interface';
import { getSignedUrl } from 'src/services/s3.service';
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

  @Column({
    nullable: true,
    transformer: {
      from(value: string) {
        if (value) {
          return getSignedUrl(value);
        }

        return value;
      },

      to(value: string) {
        return value;
      },
    },
  })
  avatar: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  location: string;

  @Column({
    nullable: true,
    default: EUserStatus.OFFLINE,
  })
  status: EUserStatus;

  @Column({
    enum: EUserStatus,
    default: EUserActiveStatus.Inactive,
    name: 'user_active_status',
  })
  activeStatus: EUserActiveStatus;

  @Column({ enum: EUserRole, default: EUserRole.USER })
  role: EUserRole;
}
