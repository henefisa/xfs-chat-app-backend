import { FindOneOptions } from 'typeorm';
import Database from 'src/configs/Database';
import { UserFriend } from 'src/entities/user-friend.entity';
import { getLimitAndOffset } from 'src/shares/get-limit-and-offset';
import { GetUserFriendsOptions } from 'src/interfaces/user-friend.interface';
import { FriendRequestDto, GetUserFriendDto } from 'src/dto/friend';

const userFriendRepository = Database.instance
	.getDataSource('default')
	.getRepository(UserFriend);

export const friendRequest = async (id: string, dto: FriendRequestDto) => {
	const friend = new UserFriend();
	const request = {
		userTarget: dto.userTarget,
		owner: id,
	};
	Object.assign(friend, request);
	return userFriendRepository.save(friend);
};

export const getOne = async (option: FindOneOptions<UserFriend>) => {
	return userFriendRepository.findOne(option);
};

export const getFriends = async (
	id: string,
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

	query.leftJoinAndSelect('friends.owner', 'users');

	query.andWhere('friends.userTarget = :id', { id: id });

	if (dto?.status) {
		query.andWhere('friends.status = :s', { s: dto?.status });
	}

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