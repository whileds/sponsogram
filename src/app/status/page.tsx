"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Rocket,
  CheckCircle2,
  Clock,
  UserCheck,
  Video,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  MessageSquare,
  Calendar,
  LogOut,
  ChevronRight,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function StatusPage() {
  const { user, logout, refresh } = useAuth();
  const [activeTab, setActiveTab] = useState<"timeline" | "manager" | "checklist">("timeline");
  useEffect(() => {
    refresh();
  }, [refresh]);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <p className="text-slate-600 text-sm">Please log in to view your application status.</p>
          <Link href="/login" className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const stages = [
    {
      id: "submitted",
      title: "1. Application Submitted",
      description: "Application received and logged into Cohort #4 queue.",
      status: "completed",
      time: "July 21, 2026",
    },
    {
      id: "under_review",
      title: "2. Channel & Niche Audit",
      description: `Assigned Personal Manager (${user.assignedManager?.name}) is analyzing hook performance and scripting opportunities.`,
      status: user.status === "submitted" ? "pending" : "current",
      time: "In Progress",
    },
    {
      id: "approved",
      title: "3. Video Editing & Mentor Allocation",
      description: "Assigning dedicated video editor for 2 reels/week and setting up 15-day strategy session calendar.",
      status: user.status === "approved" ? "completed" : "pending",
      time: "Pending Approval",
    },
    {
      id: "onboarded",
      title: "4. Full Creator OS Dashboard Access",
      description: "Unlock Sponsogram AI Toolkit with Unlimited credits, Brand Collab board, and Creator Matchmaking.",
      status: user.status === "onboarded" ? "completed" : "pending",
      time: "Final Stage",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Header Navigation */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
              <Rocket className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900">
              Sponsogram <span className="text-indigo-600 text-xs px-2 py-0.5 rounded bg-indigo-50 font-bold border border-indigo-200">OS</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Go to Creator Dashboard</span>
            </Link>

            <div className="hidden sm:flex items-center gap-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-9 h-9 rounded-full object-cover border border-slate-200"
              />
              <div className="text-left">
                <div className="text-xs font-bold text-slate-900">{user.name}</div>
                <div className="text-[10px] text-slate-500 font-semibold">{user.socialHandle}</div>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Creator Profile & Status Banner */}
        <div className="rounded-3xl bg-white border border-slate-200/80 shadow-lg p-6 sm:p-8 mb-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-200 shadow-md"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{user.name}</h1>
                  <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-extrabold text-xs border border-indigo-200">
                    {user.package}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  {user.socialHandle} • {user.niche} • {user.followerCount} Followers
                </p>
              </div>
            </div>

            {/* Interactive Status Switcher Demo Bar */}
            
          </div>
        </div>

        {/* Content Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: 4-Step Timeline Pipeline */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
              <h3 className="font-extrabold text-lg text-slate-900 mb-2">
                Onboarding & Evaluation Pipeline
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Your application is currently under active review by the Sponsogram Incubation team.
              </p>

              {/* Pipeline List */}
              <div className="relative pl-6 border-l-2 border-slate-200 space-y-8">
                {stages.map((stage, idx) => (
                  <div key={stage.id} className="relative">
                    {/* Circle Node */}
                    <div
                      className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                        stage.status === "completed"
                          ? "bg-emerald-500 border-emerald-600 text-white"
                          : stage.status === "current"
                          ? "bg-amber-500 border-amber-600 text-white animate-pulse"
                          : "bg-white border-slate-300 text-slate-400"
                      }`}
                    >
                      {stage.status === "completed" ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        idx + 1
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-slate-900 text-sm">{stage.title}</h4>
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                          stage.status === "completed"
                            ? "bg-emerald-50 text-emerald-700"
                            : stage.status === "current"
                            ? "bg-amber-50 text-amber-700 font-bold"
                            : "bg-slate-100 text-slate-400"
                        }`}>
                          {stage.time}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{stage.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Steps Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900 to-indigo-950 text-white shadow-xl flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1">
                  Ready to Access Incubation Suite?
                </div>
                <h4 className="text-lg font-bold text-white">Unlock Creator OS Tools</h4>
                <p className="text-xs text-slate-300">Access video editing submissions, AI scripts, and brand deals.</p>
              </div>
              <Link
                href="/dashboard"
                className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
              >
                <span>Enter Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Personal Manager Widget */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Personal Manager Info */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">
                  Assigned Manager
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                  Online
                </span>
              </div>

              <div className="flex items-center gap-3.5 mb-4">
                <img
                  src={user.assignedManager?.avatar}
                  alt={user.assignedManager?.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100 shadow-sm"
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{user.assignedManager?.name}</h4>
                  <p className="text-[11px] text-slate-500 font-medium">{user.assignedManager?.role}</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 mb-5 leading-relaxed">
                &quot;Hi Rohan! I&apos;m currently auditing your last 5 YouTube Reels for script hook improvements. Expect my notes shortly!&quot;
              </div>

              <button className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Message {user.assignedManager?.name.split(" ")[0]}
              </button>
            </div>

            {/* Virality Strategy Session Booking */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">15-Day Strategy Call</h4>
                  <p className="text-[11px] text-slate-500">Scheduled upon approval</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Bi-weekly virality session with the Sponsogram Team to boost subscriber growth targets.
              </p>
              <Link
                href="/dashboard/mentorship"
                className="w-full py-2.5 rounded-xl font-bold text-xs bg-slate-900 text-white hover:bg-slate-800 flex items-center justify-center gap-2"
              >
                <span>Book Strategy Call</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
