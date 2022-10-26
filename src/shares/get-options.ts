import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

export interface GetOptions<Entity extends ObjectLiteral> {
	id?: string;
	unlimited?: boolean;
	extraBuilder?: (
		query: SelectQueryBuilder<Entity>
	) => SelectQueryBuilder<Entity>;
}
