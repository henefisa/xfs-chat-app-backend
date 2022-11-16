import { BaseEntity } from 'src/shares';
import { Entity, ManyToOne } from 'typeorm';
import { Message } from './message.entity';
import { User } from './user.entity';

@Entity('message_hided')
export class MessageHided extends BaseEntity {
  @ManyToOne(() => Message, (message) => message.messageHided)
  message: Message;

  @ManyToOne(() => User)
  eraser: User;
}
