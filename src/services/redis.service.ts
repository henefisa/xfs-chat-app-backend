import redis from 'src/configs/Redis';
import { getOnlineIdKey } from 'src/utils/redis';

export const getListOnlineKeyOfUser = async (userId: string) => {
  try {
    const arrString = await redis.get(getOnlineIdKey(userId));
    const arraySocketId = JSON.parse(arrString || '[]');
    return arraySocketId;
  } catch (error) {
    console.log(error);
  }
};
