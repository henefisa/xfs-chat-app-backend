import { Participans } from "./participans.entity";
import { BaseEntity } from "../shares";
import { Column, Entity, OneToMany } from "typeorm";
import { Message } from "./message.entity";

@Entity("conversations")
export class Conversation extends BaseEntity {
  @Column()
  tittle: string;

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];

  @OneToMany(() => Participans, (participans) => participans.conversation)
  participans: Participans[];
}
