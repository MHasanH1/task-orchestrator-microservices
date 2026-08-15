"use client";

import { useTasks } from "@/hooks/useTasks";
import { MetricCards } from "@/components/MetricCards";
import { TaskForm } from "@/components/TaskForm";
import { TaskList } from "@/components/TaskList";

export default function DashboardPage() {
  const { tasks, metrics, cacheSource, isSubmitting, createTask } =
    useTasks(2000);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Task Orchestrator
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Distributed asynchronous job processing with Next.js, Redis &
              BullMQ
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/api/health"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg transition-colors"
            >
              Healthcheck API ↗
            </a>
          </div>
        </div>

        <MetricCards metrics={metrics} />

        <TaskForm onSubmit={createTask} isSubmitting={isSubmitting} />

        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>
            Cache Source:{" "}
            <strong className="text-slate-400 uppercase font-mono">
              {cacheSource || "INITIALIZING..."}
            </strong>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Cluster Status:{" "}
            <strong className="text-emerald-400 font-mono">HEALTHY</strong>
          </span>
        </div>

        <TaskList tasks={tasks} />
      </div>
    </div>
  );
}
