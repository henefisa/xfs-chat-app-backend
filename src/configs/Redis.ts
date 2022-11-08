import Redis from 'ioredis';
import { config } from 'dotenv';

config();

const redis = new Redis({
  port: Number(process.env.REDIS_PORT) || 6379,
  host: process.env.REDIS_HOST || 'localhost',
});

redis.on('ready', () => {
  console.log('Redis connected');
});

redis.on('error', (error) => {
  console.log(error);
});

export default redis;
