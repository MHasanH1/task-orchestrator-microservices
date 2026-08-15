"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Task, TaskMetrics } from "@/types/task";

export function useTasks(pollIntervalMs: number = 2000) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [cacheSource, setCacheSource] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      if (data.success) {
        setTasks(data.data);
        setCacheSource(data.source);
        setError(null);
      } else {
        setError(data.error || "Failed to fetch tasks");
      }
    } catch (err) {
      setError("Network error while fetching tasks");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    const timer = setInterval(fetchTasks, pollIntervalMs);
    return () => clearInterval(timer);
  }, [fetchTasks, pollIntervalMs]);

  const createTask = async (title: string): Promise<boolean> => {
    if (!title.trim()) return false;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      if (res.ok) {
        await fetchTasks();
        return true;
      }
      return false;
    } catch (err) {
      setError("Failed to dispatch task");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const metrics: TaskMetrics = useMemo(() => {
    return {
      total: tasks.length,
      pending: tasks.filter((t) => t.status === "PENDING").length,
      processing: tasks.filter((t) => t.status === "PROCESSING").length,
      completed: tasks.filter((t) => t.status === "COMPLETED").length,
      failed: tasks.filter((t) => t.status === "FAILED").length,
    };
  }, [tasks]);

  return {
    tasks,
    metrics,
    cacheSource,
    isLoading,
    isSubmitting,
    error,
    createTask,
    refetch: fetchTasks,
  };
}
