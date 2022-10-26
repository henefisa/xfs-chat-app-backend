import { FindOneOptions } from 'typeorm';
import Database from 'src/configs/Database';
import { FriendRequestDto } from 'src/dto/user/friend-request.dto';
import { UserFriend } from 'src/entities/user-friend.entity';
import { getLimitAndOffset } from 'src/shares/get-limit-and-offset';
import { GetUserFriendDto } from 'src/dto/user';
import { GetUserFriendsOptions } from 'src/interfaces/user-friend.interface';

const userFriendRepository = Database.instance
	.getDataSource('default')
	.getRepository(UserFriend);

export const friendRequest = async (dto: FriendRequestDto) => {
	const friend = new UserFriend();
	Object.assign(friend, dto);
	return userFriendRepository.save(friend);
};

export const getOne = async (option: FindOneOptions<UserFriend>) => {
	return userFriendRepository.findOne(option);
};

export const getFriends = async (
	status?: string,
	dto?: GetUserFriendDto,
	options?: GetUserFriendsOptions
) => {
	const { limit, offset } = getLimitAndOffset({
		limit: dto?.limit,
		offset: dto?.offset,
	});

	const query = userFriendRepository.createQueryBuilder('friends');

	if (!options?.unlimited) {
		query.skip(offset).take(limit);
	}

	query.leftJoinAndSelect('friends.user', 'users');

	if (dto?.owner) {
		query.andWhere('friends.owner = :id', { id: dto?.owner });
	}

	query.andWhere('friends.status = :s', { s: status });

	if (options?.id) {
		query.andWhere('friends.id = :id', { id: options.id });
	}

	query.orderBy('friends.createdAt', 'DESC');

	const [friends, count] = await query.getManyAndCount();

	return {
		friends,
		count,
	};
};
