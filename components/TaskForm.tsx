"use client";

import { useState } from "react";

interface Props {
  onSubmit: (title: string) => Promise<boolean>;
  isSubmitting: boolean;
}

export function TaskForm({ onSubmit, isSubmitting }: Props) {
  const [title, setTitle] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    const success = await onSubmit(title);
    if (success) setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter payload (e.g. Ingest analytics batch)..."
        className="flex-1 px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 font-semibold rounded-xl transition-colors shadow-lg shadow-blue-950/40"
      >
        {isSubmitting ? "Dispatching..." : "Dispatch Task"}
      </button>
    </form>
  );
}
