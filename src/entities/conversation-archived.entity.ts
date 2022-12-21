import moment from 'moment';
import { Conversation, User } from 'src/entities';
import { BaseEntity } from 'src/shares';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('conversation_archived')
export class ConversationArchive extends BaseEntity {
  @Column({
    name: 'delete_at',
    type: 'timestamp with time zone',
    default: null,
    transformer: {
      from(value) {
        return moment(value);
      },
      to(value) {
        return value;
      },
    },
  })
  deleteAt: moment.Moment;

  @ManyToOne(() => Conversation)
  conversation: Conversation;

  @ManyToOne(() => User)
  user: User;

  @Column({ name: 'is_hided', default: true })
  isHided: boolean;
}
