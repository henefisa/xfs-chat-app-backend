import { ENotificationType } from 'src/interfaces/notification.interface';
import { BaseEntity } from 'src/shares';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from './user.entity';
@Entity('notification')
export class Notification extends BaseEntity {
  @Column({
    name: 'readed_at',
    type: 'timestamp',
    nullable: true,
  })
  readedAt: string;

  @Column({ enum: ENotificationType, default: ENotificationType.FriendRequest })
  type: ENotificationType;

  @ManyToOne(() => User)
  recipient: User;

  @ManyToOne(() => User)
  sender: User;
}
