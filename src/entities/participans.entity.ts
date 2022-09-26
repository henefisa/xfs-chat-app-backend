import { BaseEntity } from "../shares";
import { Column, Entity, ManyToOne } from "typeorm";
import { Conversation } from "./conversation.entity";
import { User } from "./user.entity";

@Entity("participans")
export class Participans extends BaseEntity {
  @ManyToOne(() => Conversation, (conversations) => conversations.participans)
  conversation: Conversation;

  @ManyToOne(() => User, (users) => users.participans)
  owner: User;
}
