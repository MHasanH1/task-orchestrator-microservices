import { Task } from "@/types/task";
import { StatusBadge } from "./StatusBadge";

interface Props {
  tasks: Task[];
}

export function TaskList({ tasks }: Props) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl text-slate-500">
        No tasks dispatched yet. Submit a task above to start worker processing.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between gap-4"
        >
          <div className="space-y-1">
            <p className="font-medium text-slate-200">{task.title}</p>
            {task.result && (
              <p className="text-xs text-slate-400 font-mono">{task.result}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={task.status} />
            <span className="text-xs text-slate-500 font-mono">
              {new Date(task.createdAt).toLocaleTimeString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
