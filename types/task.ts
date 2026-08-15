export type TaskStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  result?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TaskMetrics {
  total: number;
  pending: number;
  processing: number;
  completed: number;
  failed: number;
}
