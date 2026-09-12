"use client";

import React, { useEffect, useState } from "react";
import {
  Video,
  ExternalLink,
  Clock,
  User,
  FileVideo,
  Save,
} from "lucide-react";

interface EditingTask {
  id: string;
  title: string;
  rawFootageUrl: string;
  instructions?: string | null;
  format: string;
  status: string;
  progress: number;
  finalVideoUrl?: string | null;
  submittedAt: string;
  creator: {
    name: string | null;
    email: string;
  };
}

export default function EditorPage() {
  const [tasks, setTasks] = useState<EditingTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTasks = async () => {
    try {
      const res = await fetch("/api/editor/tasks");

      if (!res.ok) {
        throw new Error("Failed to load tasks");
      }

      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load assigned editing tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const updateTask = async (
    id: string,
    status: string,
    progress: number,
    finalVideoUrl: string
  ) => {
    try {
      const res = await fetch("/api/editor/tasks", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          status,
          progress,
          finalVideoUrl: finalVideoUrl || null,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update task");
      }

      await loadTasks();
    } catch (err) {
      console.error(err);
      setError("Unable to update editing task.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold">
              Sponsogram{" "}
              <span className="text-amber-400 text-xs">EDITOR</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Video Editing Workspace
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Heading */}
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold mb-2">
            <Video className="w-4 h-4" />
            MY EDITING TASKS
          </div>

          <h2 className="text-3xl font-extrabold text-slate-900">
            Assigned Videos
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Manage the videos assigned to you.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            {error}
          </div>
        )}

        {/* Tasks */}
        {loading ? (
          <div className="bg-white rounded-3xl p-12 text-center text-sm text-slate-500">
            Loading your editing tasks...
          </div>
        ) : tasks.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
            <FileVideo className="mx-auto w-12 h-12 text-slate-300 mb-3" />

            <h3 className="font-extrabold text-slate-800">
              No videos assigned
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Videos assigned to you will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onUpdate={updateTask}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function TaskCard({
  task,
  onUpdate,
}: {
  task: EditingTask;
  onUpdate: (
    id: string,
    status: string,
    progress: number,
    finalVideoUrl: string
  ) => Promise<void>;
}) {
  const [status, setStatus] = useState(task.status);
  const [progress, setProgress] = useState(task.progress);
  const [finalVideoUrl, setFinalVideoUrl] = useState(
    task.finalVideoUrl || ""
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);

    await onUpdate(
      task.id,
      status,
      progress,
      finalVideoUrl
    );

    setSaving(false);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
      {/* Top */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg font-extrabold text-slate-900">
              {task.title}
            </h3>

            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-bold">
              {task.format}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
            <User className="w-3.5 h-3.5" />
            <span className="font-semibold text-slate-700">
              {task.creator.name || "Unknown Creator"}
            </span>
            <span>•</span>
            <span>{task.creator.email}</span>
          </div>

          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
            <Clock className="w-3.5 h-3.5" />
            Submitted{" "}
            {new Date(task.submittedAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Raw footage */}
      <div className="mt-5">
        <a
          href={
            task.rawFootageUrl.startsWith("http")
              ? task.rawFootageUrl
              : `https://${task.rawFootageUrl}`
          }
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:underline"
        >
          <ExternalLink className="w-4 h-4" />
          View Raw Footage
        </a>
      </div>

      {/* Instructions */}
      {task.instructions && (
        <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <p className="text-[11px] font-bold text-slate-500 uppercase mb-1">
            Instructions
          </p>
          <p className="text-sm text-slate-700">
            {task.instructions}
          </p>
        </div>
      )}

      {/* Status */}
      <div className="mt-5">
        <label className="block text-xs font-bold text-slate-600 mb-2">
          Status
        </label>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full md:w-64 px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        >
          <option value="SUBMITTED">Submitted</option>
          <option value="IN_REVIEW">In Review</option>
          <option value="EDITING">Editing</option>
          <option value="READY">Ready</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      {/* Progress */}
      <div className="mt-5">
        <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={(e) => setProgress(Number(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Final video */}
      <div className="mt-5">
        <label className="block text-xs font-bold text-slate-600 mb-2">
          Final Video URL
        </label>

        <input
          type="url"
          value={finalVideoUrl}
          onChange={(e) => setFinalVideoUrl(e.target.value)}
          placeholder="https://drive.google.com/..."
          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-5 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold disabled:opacity-60"
      >
        <Save className="w-4 h-4" />
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}