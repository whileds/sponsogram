"use client";

import React, { useEffect, useState } from "react";
import {
  Video,
  ExternalLink,
  Clock,
  User,
  FileVideo,
} from "lucide-react";

interface EditingTask {
  id: string;
  title: string;
  rawFootageUrl: string;
  instructions?: string | null;
  format: string;
  status: string;
  assignedEditor?: string | null;
  progress: number;
  finalVideoUrl?: string | null;
  submittedAt: string;
  creator: {
    id: string;
    name: string | null;
    email: string;
  };
}

interface Editor {
  id: string;
  name: string;
  email: string;
  title: string | null;
}

export default function AdminEditingPage() {
  const [tasks, setTasks] = useState<EditingTask[]>([]);
  const [editors, setEditors] = useState<Editor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [tasksRes, editorsRes] = await Promise.all([
          fetch("/api/admin/editing"),
          fetch("/api/admin/editors"),
        ]);

        if (!tasksRes.ok) {
          throw new Error("Failed to load editing requests");
        }

        if (!editorsRes.ok) {
          throw new Error("Failed to load editors");
        }

        const tasksData = await tasksRes.json();
        const editorsData = await editorsRes.json();

        setTasks(tasksData);
        setEditors(editorsData);
      } catch (err) {
        console.error(err);
        setError("Unable to load editing data.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleEditorChange = async (
    taskId: string,
    editorId: string
  ) => {
    try {
      const res = await fetch("/api/admin/editing", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: taskId,
          assignedEditor: editorId || null,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to assign editor");
      }

      setTasks((current) =>
        current.map((task) =>
          task.id === taskId
            ? {
                ...task,
                assignedEditor:
                  editors.find((editor) => editor.id === editorId)?.name ||
                  null,
              }
            : task
        )
      );
    } catch (err) {
      console.error(err);
      setError("Unable to assign editor.");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold mb-2">
          <Video className="w-4 h-4" />
          EDITING MANAGEMENT
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900">
          Video Editing Queue
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Manage creator video submissions and editing progress.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
          {error}
        </div>
      )}

      {/* Queue */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <h2 className="font-extrabold text-slate-900">
            Submitted Videos ({tasks.length})
          </h2>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-slate-500">
            Loading editing requests...
          </div>
        ) : tasks.length === 0 ? (
          <div className="py-12 text-center">
            <FileVideo className="mx-auto w-10 h-10 text-slate-300 mb-3" />
            <p className="font-bold text-slate-700">
              No editing requests
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Creator submissions will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200"
              >
                {/* Top */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-extrabold text-slate-900">
                        {task.title}
                      </h3>

                      <span className="px-2.5 py-1 rounded-lg bg-slate-200 text-slate-700 text-[10px] font-bold">
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

                  {/* Status */}
                  <span className="px-3 py-1.5 rounded-lg bg-indigo-100 text-indigo-700 text-xs font-bold">
                    {task.status}
                  </span>
                </div>

                {/* Raw video */}
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

                {/* Progress */}
                <div className="mt-5">
                  <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                    <span>Progress</span>
                    <span>{task.progress}%</span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 transition-all"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                </div>

                {/* Editor */}
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-xs text-slate-500 font-semibold">
                    Assigned Editor:
                  </span>

                  <select
                    value={
                      editors.find(
                        (editor) => editor.name === task.assignedEditor
                      )?.id || ""
                    }
                    onChange={(e) =>
                      handleEditorChange(task.id, e.target.value)
                    }
                    className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  >
                    <option value="">Not assigned</option>

                    {editors.map((editor) => (
                      <option key={editor.id} value={editor.id}>
                        {editor.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}