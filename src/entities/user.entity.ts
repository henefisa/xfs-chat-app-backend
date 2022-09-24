import { BaseEntity } from "../shares";
import { Column, Entity } from "typeorm";

@Entity("users")
export class User extends BaseEntity {
  @Column()
  username: string;

  @Column()
  password: string;
}
