import { FindOneOptions } from 'typeorm';
import { ENotificationType } from 'src/interfaces/notification.interface';
import Database from 'src/configs/Database';
import { Notification } from 'src/entities/notification.entity';
import { NotExistException } from 'src/exceptions';

const notificationRepository = Database.instance
  .getDataSource('default')
  .getRepository(Notification);

export const saveNotification = async (
  senderId: string,
  recipientId: string,
  type?: ENotificationType | string
) => {
  const notification = new Notification();

  const request = {
    type: type || ENotificationType.FriendRequest,
    sender: senderId,
    recipient: recipientId,
  };

  Object.assign(notification, request);

  return await notificationRepository.save(notification);
};

export const readNotification = async (
  notificationId: string,
  readedAt: string
) => {
  const notification = await getOne({
    where: { id: notificationId },
  });

  if (!notification) {
    throw new NotExistException('notification');
  }

  notification.readedAt = readedAt;

  return notification;
};

export const getOne = async (options: FindOneOptions<Notification>) => {
  return notificationRepository.findOne(options);
};
