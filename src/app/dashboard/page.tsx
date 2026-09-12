"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Video,
  Wrench,
  Briefcase,
  Sparkles,
  ArrowRight,
  Plus,
  Calendar,
  MessageSquare,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const loadDashboard = async () => {
    try {
      const res = await fetch("/api/dashboard");

      if (!res.ok) {
        throw new Error("Failed to load dashboard");
      }

      const data = await res.json();
      setDashboardData(data);
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  loadDashboard();
}, []);
  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Welcome Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-extrabold text-xs border border-indigo-500/30">
              🔥 Active Package: {user?.package || "CREATOR PLUS"}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome Back, {user?.name || "Rohan"}! 👋
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
              Your incubation manager <strong className="text-white">{user?.assignedManager?.name}</strong> has reviewed your latest video edit. You have 2 videos queued for editing this week.
            </p>
          </div>

          <Link
            href="/dashboard/editing"
            className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Submit New Raw Video
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Metric 1 */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Incubation Views</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
  {loading ? "..." : dashboardData?.stats.totalViews ?? 0}
</div>
          <div className="text-xs text-emerald-600 font-bold mt-1 flex items-center gap-1">
            <span>+340% virality boost</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Videos Edited</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Video className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
  {loading ? "..." : dashboardData?.stats.videosEdited ?? 0}
</div>
          <div className="text-xs text-indigo-600 font-bold mt-1">
            2 Videos Queued This Week
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sponsogram AI Credits</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Wrench className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-purple-600">
  {loading
    ? "..."
    : dashboardData?.user?.package
      ? dashboardData.user.package
      : "No Plan"}
</div>
          <div className="text-xs text-slate-500 font-medium mt-1">
            Included in Creator Plus
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Brand Sponsorships</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
  {loading ? "..." : dashboardData?.stats.brandSponsorships ?? 0}
</div>
          <div className="text-xs text-amber-600 font-bold mt-1">
            $4,200 Secured Earnings
          </div>
        </div>

      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Quick Actions & Pipeline Preview */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Quick Actions Shortcuts */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
            <h3 className="font-extrabold text-slate-900 text-base mb-4">
              Quick Creator Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                href="/dashboard/editing"
                className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 hover:bg-indigo-100/70 transition-all text-left space-y-2 group"
              >
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                  <Video className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-slate-900 group-hover:text-indigo-600">
                  Submit Raw Video
                </div>
                <p className="text-[11px] text-slate-500">Send raw footage to your editing team</p>
              </Link>

              <Link
                href="/dashboard/toolkit"
                className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 hover:bg-purple-100/70 transition-all text-left space-y-2 group"
              >
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </div>
                <div className="font-bold text-xs text-slate-900 group-hover:text-purple-600">
                  AI Script Generator
                </div>
                <p className="text-[11px] text-slate-500">Generate high-retention hook scripts</p>
              </Link>

              <Link
                href="/dashboard/strategy"
                className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 hover:bg-amber-100/70 transition-all text-left space-y-2 group"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-slate-900 group-hover:text-amber-600">
                  Niche Strategy Hub
                </div>
                <p className="text-[11px] text-slate-500">View bi-weekly reel hook recommendations</p>
              </Link>
            </div>
          </div>

          {/* Active Editing Pipeline Preview */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-base">
                Active Video Editing Queue
              </h3>
              <Link href="/dashboard/editing" className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">10 AI Tools Replacing 9-5 Jobs</h4>
                    <p className="text-[11px] text-slate-500">Shorts / Reel Format • Editor: Alex M.</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Editing in Progress (85%)
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">How I Built a $50k Creator Stack</h4>
                    <p className="text-[11px] text-slate-500">Long-form Video • Quality Checked by Manager</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Download
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Personal Manager & Strategy Call */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Dedicated Personal Manager Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">
                Personal Manager
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                Online Now
              </span>
            </div>

            <div className="flex items-center gap-3.5">
              <img
                src={
  dashboardData?.user?.manager?.avatar ||
  "/default-avatar.png"
}
                alt="Manager"
                className="w-12 h-12 rounded-full object-cover border-2 border-indigo-200 shadow-sm"
              />
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{user?.assignedManager?.name || "Not Assigned"}</h4>
                <p className="text-[11px] text-slate-500 font-medium">{user?.assignedManager?.role || "Not Assigned"}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-950 font-medium leading-relaxed">
              &quot;Hey Rohan! Your next strategy session is locked for Friday. We&apos;ll finalize the tech sponsorship deck!&quot;
            </div>

            <button className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Chat With Ananya
            </button>
          </div>

          {/* Sponsogram Growth Guarantee */}
          <div className="p-5 rounded-3xl bg-slate-900 text-white space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Incubator Virality Guarantee</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Your personal manager ensures all edited reels adhere to high-retention hook formulas.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
