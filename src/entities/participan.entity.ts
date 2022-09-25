import { BaseEntity } from "../shares";
import { Column, Entity, ManyToOne } from "typeorm";
import { Conversation } from "./conversation.entity";
import { User } from "./user.entity";

@Entity("participans")
export class Participans extends BaseEntity {
  @ManyToOne(() => Conversation, (conversation) => conversation.participans)
  conversation: Conversation;

  @ManyToOne(() => User, (user) => user.participans)
  owner: User;
}
