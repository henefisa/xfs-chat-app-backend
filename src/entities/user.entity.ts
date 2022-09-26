import { Participans } from "./participans.entity";
import { BaseEntity } from "../shares";
import { Column, Entity, OneToMany } from "typeorm";
import { Message } from "./message.entity";

@Entity("users")
export class User extends BaseEntity {
  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  fullName: string;

  @Column()
  avatar: string;

  @Column()
  phone: string;

  @OneToMany(() => Message, (messages) => messages.owner)
  messages: Message[];

  @OneToMany(() => Participans, (participans) => participans.owner)
  participans: Participans[];
}
