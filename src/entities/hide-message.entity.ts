import { BaseEntity } from 'src/shares';
import { Entity, ManyToOne } from 'typeorm';
import { Message } from './message.entity';
import { User } from './user.entity';

@Entity('hide_message')
export class HideMessage extends BaseEntity {
  @ManyToOne(() => Message, (message) => message.hideMessage)
  message: Message;

  @ManyToOne(() => User)
  user: User;
}
