import { createServiceLogger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { Worker, Job } from "bullmq";

const redisHost = process.env.REDIS_HOST || "redis";
const redisPort = parseInt(process.env.REDIS_PORT || "6379", 10);

const redisConnection = {
  connection: {
    host: redisHost,
    port: redisPort,
  },
};

const logger = createServiceLogger("task-worker");

logger.info("[Worker] Task worker started and listening for jobs...", {
  redis: redisConnection,
});

const worker = new Worker(
  "task-processing-queue",
  async (job: Job) => {
    const { taskId, title } = job.data;
    logger.info(`[Worker] Processing task ID: #${taskId} (${title})`, {
      taskId,
      title,
    });

    await prisma.task.update({
      where: { id: taskId },
      data: { status: "PROCESSING" },
    });

    await new Promise((resolve) => setTimeout(resolve, 5000));

    await prisma.task.update({
      where: { id: taskId },
      data: {
        status: "COMPLETED",
        result: `Processed successfully: "${title}" at ${new Date().toISOString()}`,
      },
    });

    logger.info(`[Worker] Task #${taskId} completed successfully.`, {
      taskId,
    });
  },
  {
    connection: redisConnection.connection,
    concurrency: 5,
  },
);

worker.on("failed", async (job, err) => {
  if (job) {
    logger.error(`[Worker] Job #${job.id} failed with error: ${err.message}`, {
      jobId: job.id,
      errorMessage: err.message,
      stack: err.stack,
    });
    await prisma.task.update({
      where: { id: job.data.taskId },
      data: { status: "FAILED" },
    });
  }
});

worker.on("error", (err) => {
  logger.error("Unexpected worker process error", {
    errorMessage: err.message,
  });
});
