import { Queue } from "bullmq";

const redisHost = process.env.REDIS_HOST || "redis";
const redisPort = parseInt(process.env.REDIS_PORT || "6379", 10);

export const taskQueue = new Queue("task-processing-queue", {
  connection: {
    host: redisHost,
    port: redisPort,
  },
});
