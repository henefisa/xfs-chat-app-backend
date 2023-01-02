import { Conversation, User } from 'src/entities';
import { BaseEntity } from 'src/shares';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('conversation_archived')
export class ConversationArchive extends BaseEntity {
  @Column({
    name: 'deleted_at',
    type: 'timestamptz',
    nullable: true,
  })
  deletedAt: string;

  @ManyToOne(() => Conversation)
  conversation: Conversation;

  @ManyToOne(() => User)
  user: User;

  @Column({ name: 'is_hided', default: true })
  isHided: boolean;
}
