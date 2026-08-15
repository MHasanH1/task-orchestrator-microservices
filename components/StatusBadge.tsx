import { TaskStatus } from "@/types/task";

interface Props {
  status: TaskStatus;
}

export function StatusBadge({ status }: Props) {
  switch (status) {
    case "PENDING":
      return (
        <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
          Pending
        </span>
      );
    case "PROCESSING":
      return (
        <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 animate-pulse">
          Processing...
        </span>
      );
    case "COMPLETED":
      return (
        <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Completed
        </span>
      );
    case "FAILED":
      return (
        <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20">
          Failed
        </span>
      );
  }
}
