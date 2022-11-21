import { FindOneOptions } from 'typeorm';
import Database from 'src/configs/Database';
import { UserFriend } from 'src/entities/user-friend.entity';
import { getLimitAndOffset } from 'src/shares/get-limit-and-offset';
import {
  EUserFriendRequestStatus,
  GetUserFriendsOptions,
} from 'src/interfaces/user-friend.interface';
import { FriendRequestDto, GetUserFriendDto } from 'src/dto/friend';
import { FriendActionDto } from 'src/dto/friend/friend-actions-request.dto';
import { NotFoundException } from 'src/exceptions';

const userFriendRepository = Database.instance
  .getDataSource('default')
  .getRepository(UserFriend);

export const getFriendRequest = async (
  userTargetId: string,
  ownerId: string
) => {
  const query = userFriendRepository.createQueryBuilder('f');
  query
    .andWhere('f.status != :s', { s: EUserFriendRequestStatus.REJECTED })
    .andWhere(
      '(f.userTarget = :id AND f.owner = :requestId) OR (f.owner = :id AND f.userTarget = :requestId)',
      { id: userTargetId, requestId: ownerId }
    );

  return query.getOne();
};

export const approveFriendRequest = async (
  dto: FriendActionDto,
  id: string
) => {
  const friendRequest = await getFriendRequest(id, dto.userRequest);

  if (!friendRequest) {
    throw new NotFoundException('friend_request');
  }

  friendRequest.status = EUserFriendRequestStatus.ACCEPTED;
  return userFriendRepository.save(friendRequest);
};

export const cancelRequest = async (dto: FriendActionDto, id: string) => {
  const friendRequest = await getFriendRequest(id, dto.userRequest);

  if (!friendRequest) {
    throw new NotFoundException('friend_request');
  }

  friendRequest.status = EUserFriendRequestStatus.REJECTED;
  return userFriendRepository.save(friendRequest);
};

export const friendRequest = async (id: string, dto: FriendRequestDto) => {
  const friendRequest = await getFriendRequest(id, dto.userTarget);

  if (friendRequest) {
    return friendRequest;
  }

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

  query.where('friends.userTarget = :id ', { id: id });

  if (dto?.q) {
    query.andWhere('(full_name ILIKE :q) OR (username ILIKE :q)', {
      q: `%${dto.q}%`,
    });
  }

  if (dto?.status) {
    query.andWhere('friends.status = :s', { s: dto?.status });
  }

  query.orderBy('friends.createdAt', 'DESC');

  const [friends, count] = await query.getManyAndCount();

  return {
    friends,
    count,
  };
};
