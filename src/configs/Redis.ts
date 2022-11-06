import Redis from 'ioredis';

const redis = new Redis(6379);

redis.on('ready', () => {
  console.log('Redis connected');
});

redis.on('error', (error) => {
  console.log(error);
});

export default redis;
