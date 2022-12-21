import { EEmotionType } from 'src/interfaces/emotion.interface';
import { BaseEntity } from 'src/shares';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Message } from './message.entity';
import { User } from './user.entity';

@Entity('emotion')
export class Emotion extends BaseEntity {
  @ManyToOne(() => Message, (message) => message.emoticons)
  message: Message;

  @ManyToOne(() => User)
  user: User;

  @Column({ enum: EEmotionType })
  type: string;
}
