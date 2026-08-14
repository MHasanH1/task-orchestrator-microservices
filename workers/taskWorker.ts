import { prisma } from "@/lib/prisma";
import { Worker, Job } from "bullmq";

const redisHost = process.env.REDIS_HOST || "redis";
const redisPort = parseInt(process.env.REDIS_PORT || "6379", 10);

console.log("[Worker] Task worker started and listening for jobs...");

const worker = new Worker(
  "task-processing-queue",
  async (job: Job) => {
    const { taskId, title } = job.data;
    console.log(`[Worker] Processing task ID: ${taskId} (${title})`);

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

    console.log(`[Worker] Task ${taskId} completed successfully.`);
  },
  {
    connection: {
      host: redisHost,
      port: redisPort,
    },
  },
);

worker.on("failed", async (job, err) => {
  if (job) {
    console.error(`[Worker] Job ${job.id} failed with error: ${err.message}`);
    await prisma.task.update({
      where: { id: job.data.taskId },
      data: { status: "FAILED" },
    });
  }
});
