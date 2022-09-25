import { User } from "src/entities/user.entity";
import { Conversation } from "./conversation.entity";
import { BaseEntity } from "../shares";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity("messages")
export class Message extends BaseEntity {
  @Column()
  message: string;

  @Column()
  attachment: string;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages)
  conversation: Conversation;

  @ManyToOne(() => User, (user) => user.messages)
  owner: User;
}
