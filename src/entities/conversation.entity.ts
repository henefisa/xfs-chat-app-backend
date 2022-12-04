import { Participants } from './participants.entity';
import { BaseEntity } from '../shares';
import { Column, Entity, OneToMany } from 'typeorm';
import { Message } from './message.entity';
import { getSignedUrl } from 'src/services/s3.service';

@Entity('conversations')
export class Conversation extends BaseEntity {
  @Column({ nullable: true })
  title: string;

  @Column({ default: false, name: 'is_group' })
  isGroup: boolean;

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

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];

  @OneToMany(() => Participants, (participants) => participants.conversation)
  participants: Participants[];
}
