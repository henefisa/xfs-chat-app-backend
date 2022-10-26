import { Message } from 'src/entities/message.entity';
import { GetOptions } from 'src/shares/get-options';

export enum EMessageStatus {
	Sended = 'SENDED',
	Received = 'RECEIVED',
	Seen = 'SEEN',
}

export type GetMessageOptions = GetOptions<Message>;
