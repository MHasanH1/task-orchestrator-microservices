import { prisma } from "@/lib/prisma";
import { PostReqData } from "@/types/taskAPI";
import {
  badRequest,
  created,
  serverError,
  success,
} from "@/utils/responseHandler";
import { redis } from "@/lib/redis";
import { taskQueue } from "@/lib/queue";
import { logger } from "@/lib/logger";

const CACHE_KEY = "tasks:all";

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown error";
}

export async function GET() {
  try {
    const cachedTasks = await redis.get(CACHE_KEY);

    if (cachedTasks) {
      return success({
        data: JSON.parse(cachedTasks),
        source: "redis",
      });
    }

    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: "desc" },
    });

    await redis.set(CACHE_KEY, JSON.stringify(tasks), "EX", 60);

    return success({ data: tasks, source: "database" });
  } catch (error: unknown) {
    logger.error("Error fetching tasks:", { error });
    return serverError({
      error: "Error fetching tasks",
      details: getErrorMessage(error),
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as PostReqData;
    const { title } = body;

    if (!title?.trim()) {
      return badRequest({ error: "Title is required" });
    }

    const newTask = await prisma.task.create({
      data: {
        title: title.trim(),
        status: "PENDING",
      },
    });

    try {
      await taskQueue.add("process-task", {
        taskId: newTask.id,
        title: newTask.title,
      });
    } catch (queueError) {
      try {
        await prisma.task.delete({
          where: { id: newTask.id },
        });
      } catch (cleanupError) {
        logger.error("Failed to cleanup task after queue error:", {
          taskId: newTask.id,
          error: cleanupError,
        });
      }

      throw queueError;
    }

    await redis.del(CACHE_KEY);

    return created({ data: newTask });
  } catch (error: unknown) {
    logger.error("Error while creating a new task:", { error });
    return serverError({
      error: "Error while creating a new task",
      details: getErrorMessage(error),
    });
  }
}

export async function DELETE() {
  try {
    const id = "";

    const deletedTask = await prisma.task.delete({
      where: {
        id,
      },
    });

    return success({ data: deletedTask });
  } catch (error: unknown) {
    logger.error("Error while deleting a task:", { error });
    return serverError({
      error: "Error while deleting a task",
      details: getErrorMessage(error),
    });
  }
}
