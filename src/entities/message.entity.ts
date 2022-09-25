import { User } from 'src/entities/user.entity';
import { Conversation } from './conversation.entity';
import { BaseEntity } from "../shares";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity("messages")
export class Message extends BaseEntity {

    @ManyToOne(() => Conversation, (conversation) => conversation.messages)
    conversation: Conversation;

    @ManyToOne(() => User, (user) => user.messages)
    user: User;

    @Column()
    message:string;

    @Column()
    attachment:string;
}