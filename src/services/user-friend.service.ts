import { Equal, FindOneOptions } from 'typeorm';
import Database from 'src/configs/Database';
import { getLimitAndOffset } from 'src/shares/get-limit-and-offset';
import { EUserFriendRequestStatus } from 'src/interfaces/user-friend.interface';
import { FriendRequestDto, GetUserFriendDto } from 'src/dto/friend';
import { FriendActionDto } from 'src/dto/friend/friend-actions-request.dto';
import { NotExistException } from 'src/exceptions';
import { FriendRequest } from 'src/entities/friend-request.entity';
import { FriendWasRequested } from 'src/entities/friend-was-requested.entity';

const friendRequestRepository = Database.instance
  .getDataSource('default')
  .getRepository(FriendRequest);

const friendWasRequestedRepository = Database.instance
  .getDataSource('default')
  .getRepository(FriendWasRequested);

export const getFriendRequest = async (
  userTargetId: string,
  ownerId: string
) => {
  const friendRequest = await getOneFriendRequest({
    where: {
      userTarget: Equal(userTargetId),
      owner: Equal(ownerId),
    },
  });

  if (!friendRequest) {
    throw new NotExistException('friend_request');
  }

  return friendRequest;
};

export const getFriendWasRequested = async (
  userTargetId: string,
  ownerId: string
) => {
  const Requested = await getOneFriendWasRequested({
    where: {
      userTarget: Equal(userTargetId),
      owner: Equal(ownerId),
    },
  });

  if (!Requested) {
    throw new NotExistException('friend_Was_request');
  }

  return Requested;
};

export const approveFriendRequest = async (
  dto: FriendActionDto,
  id: string
) => {
  const friendRequest = await getFriendRequest(id, dto.userRequest);
  const friendWasRequested = await getFriendWasRequested(id, dto.userRequest);

  friendRequest.status = EUserFriendRequestStatus.ACCEPTED;
  friendWasRequested.status = EUserFriendRequestStatus.ACCEPTED;
  await friendRequestRepository.save(friendRequest);
  await friendWasRequestedRepository.save(friendWasRequested);
};

export const cancelFriendRequest = async (dto: FriendActionDto, id: string) => {
  await friendRequestRepository.delete({
    userTarget: Equal(id),
    owner: Equal(dto.userRequest),
  });
  await friendWasRequestedRepository.delete({
    userTarget: Equal(id),
    owner: Equal(dto.userRequest),
  });
};

export const cancelRequestToUser = async (dto: FriendActionDto, id: string) => {
  await friendRequestRepository.delete({
    userTarget: Equal(dto.userRequest),
    owner: Equal(id),
  });
  await friendWasRequestedRepository.delete({
    userTarget: Equal(dto.userRequest),
    owner: Equal(id),
  });
};

export const friendRequest = async (id: string, dto: FriendRequestDto) => {
  const friendRequest = new FriendRequest();
  const friendWasRequested = new FriendWasRequested();
  const request = {
    userTarget: dto.userTarget,
    owner: id,
  };
  Object.assign(friendRequest, request);
  Object.assign(friendWasRequested, request);
  await friendWasRequestedRepository.save(friendWasRequested);
  return friendRequestRepository.save(friendRequest);
};

export const getOneFriendRequest = async (
  option: FindOneOptions<FriendRequest>
) => {
  return friendRequestRepository.findOne(option);
};

export const getOneFriendWasRequested = async (
  option: FindOneOptions<FriendWasRequested>
) => {
  return friendWasRequestedRepository.findOne(option);
};

export const getListRequest = async (id: string, dto?: GetUserFriendDto) => {
  const { limit, offset } = getLimitAndOffset({
    limit: dto?.limit,
    offset: dto?.offset,
  });

  const query = friendWasRequestedRepository.createQueryBuilder('friends');

  query.skip(offset).take(limit);

  query.leftJoinAndSelect('friends.owner', 'users');

  query.where('friends.userTarget = :id ', { id: id });

  if (dto?.q) {
    query.andWhere(
      '(full_name ILIKE :q OR username ILIKE :q) AND (u.id != :userId)',
      {
        q: `%${dto.q}%`,
        userId: id,
      }
    );
  }

  query.andWhere('friends.status = :s', {
    s: EUserFriendRequestStatus.REQUESTED,
  });

  query.orderBy('friends.createdAt', 'DESC');

  const [friends, count] = await query.getManyAndCount();

  return {
    friends,
    count,
  };
};

export const getListSendRequest = async (
  id: string,
  dto?: GetUserFriendDto
) => {
  const { limit, offset } = getLimitAndOffset({
    limit: dto?.limit,
    offset: dto?.offset,
  });

  const query = friendWasRequestedRepository.createQueryBuilder('friends');

  query.skip(offset).take(limit);

  query.leftJoinAndSelect('friends.userTarget', 'users');

  query.where('friends.owner = :id ', { id: id });

  if (dto?.q) {
    query.andWhere(
      '(full_name ILIKE :q OR username ILIKE :q) AND (u.id != :userId)',
      {
        q: `%${dto.q}%`,
        userId: id,
      }
    );
  }

  query.andWhere('friends.status = :s', {
    s: EUserFriendRequestStatus.REQUESTED,
  });

  query.orderBy('friends.createdAt', 'DESC');

  const [friends, count] = await query.getManyAndCount();

  return {
    friends,
    count,
  };
};
