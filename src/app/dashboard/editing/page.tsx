"use client";

import React, { useEffect, useState } from "react";
import {
  Video,
  Upload,
  Clock,
  Download,
  Plus,
  FileVideo,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface VideoTask {
  id: string;
  title: string;
  format: "Reels / Shorts" | "Long-Form Video";
  rawLink: string;
  editor: string;
  status: "SUBMITTED" | "IN_REVIEW" | "EDITING" | "READY" | "COMPLETED";
  progress: number;
  downloadUrl?: string;
  submittedDate: string;
}

export default function EditingPipelinePage() {
  const { user } = useAuth();

  const [tasks, setTasks] = useState<VideoTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newLink, setNewLink] = useState("");
  const [newFormat, setNewFormat] =
    useState<"Reels / Shorts" | "Long-Form Video">("Reels / Shorts");

  const [quota, setQuota] = useState({
    used: 0,
    limit: 0,
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Load real editing requests from PostgreSQL
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const res = await fetch("/api/editing");

        if (!res.ok) {
          throw new Error("Failed to load editing requests");
        }

        const data = await res.json();

        setTasks(data.tasks ?? []);
        setQuota(data.quota ?? { used: 0, limit: 0 });
      } catch (err) {
        console.error(err);
        setError("Unable to load your editing queue.");
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  const handleAddNewTask = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/editing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newTitle,
          rawLink: newLink,
          format: newFormat,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Unable to submit video.");
        return;
      }

      // Add the real database record to the UI
      setTasks((current) => [data.task, ...current]);

      setQuota((current) => ({
        ...current,
        used: current.used + 1,
      }));

      setShowSubmitModal(false);
      setNewTitle("");
      setNewLink("");
      setNewFormat("Reels / Shorts");
    } catch (err) {
      console.error(err);
      setError("Something went wrong while submitting the video.");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusLabel = (status: VideoTask["status"]) => {
    switch (status) {
      case "SUBMITTED":
        return "Raw Link Received";
      case "IN_REVIEW":
        return "Manager Review";
      case "EDITING":
        return "Editing in Progress";
      case "READY":
        return "Ready for Download";
      case "COMPLETED":
        return "Completed";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-extrabold text-xs border border-indigo-500/30 mb-2">
            <Video className="w-3.5 h-3.5 text-indigo-400" />
            <span>Dedicated Video Editing Team</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Video Editing Pipeline & Tracker
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
            Upload raw footage links and track your professional edits in
            real-time. Your current plan is{" "}
            <strong>{user?.package || "No active plan"}</strong>.
          </p>
        </div>

        <button
          onClick={() => setShowSubmitModal(true)}
          className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition-all hover:scale-105 flex items-center gap-2 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Submit Raw Video Link
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
          {error}
        </div>
      )}

      {/* Task Pipeline */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <h3 className="font-extrabold text-slate-900 text-base">
            Active Editing Queue ({tasks.length} Videos)
          </h3>

          <span className="text-xs text-slate-500 font-medium">
            Quota Used:{" "}
            <strong className="text-slate-900">
              {quota.used} / {quota.limit || 0} Videos This Week
            </strong>
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-slate-500">
            Loading your editing queue...
          </div>
        ) : tasks.length === 0 ? (
          <div className="py-12 text-center">
            <FileVideo className="mx-auto w-10 h-10 text-slate-300 mb-3" />
            <p className="font-bold text-slate-700">
              No videos submitted yet
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Submit your first raw video to start the editing process.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold shrink-0">
                    <FileVideo className="w-6 h-6" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-extrabold text-slate-900 text-sm">
                        {task.title}
                      </h4>

                      <span className="px-2.5 py-0.5 rounded bg-slate-200 text-slate-700 font-bold text-[10px]">
                        {task.format}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 font-medium mt-1">
                      Editor:{" "}
                      <span className="text-slate-800 font-semibold">
                        {task.editor}
                      </span>{" "}
                      • Submitted{" "}
                      {new Date(task.submittedDate).toLocaleDateString()}
                    </p>

                    <a
                      href={
                        task.rawLink.startsWith("http")
                          ? task.rawLink
                          : `https://${task.rawLink}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-indigo-600 hover:underline"
                    >
                      View Raw Link: {task.rawLink}
                    </a>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
                  {/* Progress */}
                  <div className="w-full md:w-36 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                      <span>Progress</span>
                      <span>{task.progress}%</span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          task.status === "COMPLETED"
                            ? "bg-emerald-500"
                            : "bg-indigo-600"
                        }`}
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Status */}
                  {task.status === "COMPLETED" ||
                  task.status === "READY" ? (
                    task.downloadUrl ? (
                      <a
                        href={task.downloadUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5 whitespace-nowrap"
                      >
                        <Download className="w-4 h-4" />
                        Download Edit
                      </a>
                    ) : (
                      <span className="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                        Ready
                      </span>
                    )
                  ) : task.status === "EDITING" ? (
                    <span className="px-3.5 py-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap">
                      <Clock className="w-4 h-4 animate-spin" />
                      Editing in Progress
                    </span>
                  ) : (
                    <span className="px-3.5 py-2 rounded-xl bg-slate-200 text-slate-700 text-xs font-bold whitespace-nowrap">
                      {getStatusLabel(task.status)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-4">
            <h3 className="font-extrabold text-slate-900 text-lg">
              Submit Raw Video For Editing
            </h3>

            <form onSubmit={handleAddNewTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Video Working Title *
                </label>

                <input
                  type="text"
                  required
                  placeholder="e.g. 5 AI Hacks You Need To Try"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Raw Footage Link *
                </label>

                <input
                  type="url"
                  required
                  placeholder="https://drive.google.com/..."
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Output Video Format
                </label>

                <select
                  value={newFormat}
                  onChange={(e) =>
                    setNewFormat(
                      e.target.value as
                        | "Reels / Shorts"
                        | "Long-Form Video"
                    )
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Reels / Shorts">
                    Short Form — Instagram Reel / YouTube Short
                  </option>

                  <option value="Long-Form Video">
                    Long Form — YouTube Video
                  </option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="w-1/3 py-3 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-2/3 py-3 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  <Upload className="w-4 h-4" />
                  {submitting ? "Submitting..." : "Submit to Editing Queue"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
