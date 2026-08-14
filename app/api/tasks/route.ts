import { prisma } from "@/lib/prisma";
import { PatchReqData, PostReqData } from "@/types/taskAPI";
import {
  badRequest,
  created,
  serverError,
  success,
} from "@/utils/responseHandler";
import { redis } from "@/lib/redis";
import { taskQueue } from "@/lib/queue";

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
      });
    }

    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: "desc" },
    });

    await redis.set(CACHE_KEY, JSON.stringify(tasks), "EX", 60);

    return success({ data: tasks });
  } catch (error: unknown) {
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

    if (!title) {
      return badRequest({ error: "Title is required" });
    }

    const newTask = await prisma.task.create({
      data: {
        title,
        status: "PENDING",
      },
    });

    await taskQueue.add("process-task", {
      taskId: newTask.id,
      title: newTask.title,
    });

    await redis.del(CACHE_KEY);

    return created({ data: newTask });
  } catch (error: unknown) {
    return serverError({
      error: "Error while creating a new task",
      details: getErrorMessage(error),
    });
  }
}

export async function PATCH(request: Request) {
  try {
    const id = "";
    const body = (await request.json()) as PatchReqData;

    const { title, completed } = body;

    const updatedTask = await prisma.task.update({
      where: {
        id,
      },
      data: {
        title,
        completed,
      },
    });

    return success({ data: updatedTask });
  } catch (error: unknown) {
    return serverError({
      error: "Error while updating a task",
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
    return serverError({
      error: "Error while deleting a task",
      details: getErrorMessage(error),
    });
  }
}
