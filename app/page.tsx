"use client";

import { useState, useEffect } from "react";

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    const res = await fetch("/api/tasks");
    const data = await res.json();
    if (data.success) setTasks(data.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    if (res.ok) {
      setTitle("");
      fetchTasks();
    }
    setLoading(false);
  };

  return (
    <main className="max-w-2xl mx-auto mt-12 p-6 bg-slate-900 text-white rounded-xl shadow-lg dir-rtl">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-400">
        داشبورد مدیریت تسک‌ها (Docker & Next.js)
      </h1>
      <form onSubmit={handleAddTask} className="flex gap-3 mb-8">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="عنوان تسک جدید را وارد کنید..."
          className="flex-1 px-4 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {loading ? "در حال ثبت..." : "افزودن"}
        </button>
      </form>
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between p-4 rounded-lg bg-slate-800 border border-slate-700"
          >
            <span
              className={task.completed ? "line-through text-gray-400" : ""}
            >
              {task.title}
            </span>
            <span className="text-xs text-slate-400 bg-slate-700 px-2 py-1 rounded">
              {task.id.slice(0, 8)}...
            </span>
          </div>
        ))}
        {tasks.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            هیچ تسکی ثبت نشده است.
          </p>
        )}
      </div>
    </main>
  );
}
