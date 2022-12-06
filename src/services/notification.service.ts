import Database from 'src/configs/Database';
import { SaveNotificationDto } from 'src/dto/notification/save-notification.dto';
import { Notification } from 'src/entities/notification.entity';

const notificationRepository = Database.instance
  .getDataSource('default')
  .getRepository(Notification);

export const saveNotification = async (
  senderId: string,
  dto: SaveNotificationDto
) => {
  const notification = new Notification();

  const request = {
    ...dto,
    sender: senderId,
    recipient: dto.recipient,
  };

  console.log(request);

  Object.assign(notification, request);

  return notificationRepository.save(notification);
};
