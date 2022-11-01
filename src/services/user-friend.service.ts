import { Equal, FindOneOptions } from 'typeorm';
import Database from 'src/configs/Database';
import { UserFriend } from 'src/entities/user-friend.entity';
import { getLimitAndOffset } from 'src/shares/get-limit-and-offset';
import {
  EUserFriendRequestStatus,
  GetUserFriendsOptions,
} from 'src/interfaces/user-friend.interface';
import { FriendRequestDto, GetUserFriendDto } from 'src/dto/friend';
import { FriendActionDto } from 'src/dto/friend/friend-actions-request.dto';
import { NotExistException } from 'src/exceptions';

const userFriendRepository = Database.instance
  .getDataSource('default')
  .getRepository(UserFriend);

export const getFriendRequest = async (
  userTargetId: string,
  ownerId: string
) => {
  const friend_request = await getOne({
    where: {
      userTarget: Equal(userTargetId),
      owner: Equal(ownerId),
    },
  });

  if (!friend_request) {
    throw new NotExistException('friend_request');
  }

  return friend_request;
};

export const approveFriendRequest = async (
  dto: FriendActionDto,
  id: string
) => {
  const friend_request = await getFriendRequest(id, dto.userRequest);

  friend_request.status = EUserFriendRequestStatus.ACCEPTED;
  return userFriendRepository.save(friend_request);
};

export const cancelFriendRequest = async (dto: FriendActionDto, id: string) => {
  await getFriendRequest(id, dto.userRequest);
  return userFriendRepository.delete({
    userTarget: Equal(id),
    owner: Equal(dto.userRequest),
  });
};

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
