import { Participants } from './../entities/participants.entity';
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
import { Conversation } from 'src/entities/conversation.entity';

const userFriendRepository = Database.instance
  .getDataSource('default')
  .getRepository(UserFriend);
const conversationRepository = Database.instance
  .getDataSource('default')
  .getRepository(Conversation);

export const getFriendRequest = async (
  userTargetId: string,
  ownerId: string
) => {
  const query = userFriendRepository.createQueryBuilder('f');
  query.andWhere(
    '((f.userTarget = :id AND f.owner = :requestId) OR (f.owner = :id AND f.userTarget = :requestId)) AND (f.status != :s)',
    {
      id: userTargetId,
      requestId: ownerId,
      s: EUserFriendRequestStatus.REJECTED,
    }
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

  query.leftJoinAndSelect('friends.owner', 'user_request');
  query.leftJoinAndSelect('friends.userTarget', 'user_target');

  query.andWhere('(friends.userTargetId = :id OR friends.ownerId = :id )', {
    id: id,
  });

  if (dto?.q) {
    query.andWhere('(full_name ILIKE :q OR username ILIKE :q)', {
      q: `%${dto.q}%`,
    });
  }

  if (dto?.status) {
    query.andWhere('friends.status = :s', { s: dto?.status });
  }

  if (dto?.status === EUserFriendRequestStatus.ACCEPTED) {
    query.andWhere('(friends.userTargetId = :id OR friends.ownerId = :id )', {
      id: id,
    });
  } else {
    query.andWhere('(friends.userTargetId = :id)', { id: id });
  }

  query.orderBy('friends.createdAt', 'DESC');

  const [friends, count] = await query.getManyAndCount();

  const promises = friends.map(async (friend) => {
    console.log('friend user target: ' + friend.userTarget.id);
    console.log('friend owner: ' + friend.owner.id);

    const secondQuery = conversationRepository.createQueryBuilder('c');
    secondQuery.where('c.isGroup = false').andWhere(
      'c.id IN' +
        secondQuery
          .subQuery()
          .select('p.conversationId')
          .from(Participants, 'p')
          .where((subQuery) => {
            subQuery
              .where('p.user = :userTargetId AND p.adder = :ownerId', {
                userTargetId: friend.owner.id,
                ownerId: friend.userTarget.id,
              })
              .orWhere('p.user = :ownerId AND p.adder = :userTargetId', {
                userTargetId: friend.owner.id,
                ownerId: friend.userTarget.id,
              });
          })
          .getQuery()
    );

    const conversation = await secondQuery.getOne();

    if (!conversation) {
      return {
        ...friend,
        conversation: null,
      };
    }

    return {
      ...friend,
      conversation: conversation,
    };
  });

  const p = await Promise.all(promises);

  return {
    p,
    count,
  };
};
