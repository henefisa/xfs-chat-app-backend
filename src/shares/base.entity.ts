import {
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';
import moment from 'moment';

export class BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@CreateDateColumn({
		name: 'createdAt',
		transformer: {
			from(value) {
				return moment(value);
			},
			to(value) {
				return value;
			},
		},
	})
	createdAt: moment.Moment;

	@UpdateDateColumn({
		name: 'updated_at',
		transformer: {
			from(value) {
				return moment(value);
			},
			to(value) {
				return value;
			},
		},
	})
	updatedAt: moment.Moment;
}
