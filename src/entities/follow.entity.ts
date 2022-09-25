import { BaseEntity } from "../shares";
import { Column, Entity, ManyToOne } from "typeorm";
import { User } from "./user.entity";

@Entity("follows")
export class Follow extends BaseEntity {

    @ManyToOne(() => User, (user) => user.follows)
    user: User;

    @Column()
    follower : string ;

    @Column()
    following : string;
}