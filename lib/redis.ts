import Redis from "ioredis";

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

const redisUrl = process.env.REDIS_URL!;

export const redis = globalForRedis.redis ?? new Redis(redisUrl);

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;
