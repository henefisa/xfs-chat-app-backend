import { BaseEntity } from "../shares";
import { Column, Entity, OneToMany } from "typeorm";
import { Message } from "./mesage.entity";
import { Participans } from "./participan.entity";

@Entity("conversations")
export class Conversation extends BaseEntity {
  @Column()
  tittle: string;

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];

  @OneToMany(() => Participans, (participans) => participans.conversation)
  participans: Participans[];
}
