import { ENotificationType } from 'src/interfaces/notification.interface';
import Database from 'src/configs/Database';
import { Notification } from 'src/entities/notification.entity';

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

  console.log(request);

  Object.assign(notification, request);

  return await notificationRepository.save(notification);
};
