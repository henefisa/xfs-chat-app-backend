import { BaseEntity } from "../shares";
import { Column, Entity, OneToMany } from "typeorm";
import { Message } from "./mesage.entity";
import { Participans } from "./participan.entity";

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

  @OneToMany(() => Message, (message) => message.owner)
  messages: Message[];

  @OneToMany(() => Participans, (participans) => participans.owner)
  participans: Participans[];
}
