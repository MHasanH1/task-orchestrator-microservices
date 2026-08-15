import { TaskMetrics } from "@/types/task";

interface Props {
  metrics: TaskMetrics;
}

export function MetricCards({ metrics }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-sm">
        <p className="text-xs font-medium text-slate-400">Total Tasks</p>
        <p className="text-2xl font-bold mt-1 text-slate-100">
          {metrics.total}
        </p>
      </div>
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-sm">
        <p className="text-xs font-medium text-amber-400">Pending</p>
        <p className="text-2xl font-bold mt-1 text-amber-400">
          {metrics.pending}
        </p>
      </div>
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-sm">
        <p className="text-xs font-medium text-blue-400">Processing</p>
        <p className="text-2xl font-bold mt-1 text-blue-400">
          {metrics.processing}
        </p>
      </div>
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-sm">
        <p className="text-xs font-medium text-emerald-400">Completed</p>
        <p className="text-2xl font-bold mt-1 text-emerald-400">
          {metrics.completed}
        </p>
      </div>
    </div>
  );
}
