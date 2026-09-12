"use client";

import React, { useState } from "react";
import { Users, Sparkles, TrendingUp, CheckCircle2, MessageSquare, ArrowRight, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface CreatorMatch {
  id: string;
  name: string;
  handle: string;
  niche: string;
  subscribers: string;
  image: string;
  proposedFormat: string;
  status: "scheduled" | "completed" | "pending";
}

export default function MatchmakingPage() {
  const { user } = useAuth();
  
  const [matches, setMatches] = useState<CreatorMatch[]>([
    {
      id: "match-1",
      name: "Priya Sharma",
      handle: "@priya_finance",
      niche: "Personal Finance",
      subscribers: "180K Subscribers",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      proposedFormat: "Co-Scripted Reel: '5 Money Hacks For Software Engineers'",
      status: "pending",
    },
    {
      id: "match-2",
      name: "Aman Kapoor",
      handle: "@aman_fit",
      niche: "Fitness & Productivity",
      subscribers: "310K Subscribers",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      proposedFormat: "Joint Story Takeover + Cross-Audience Reel",
      status: "completed",
    },
  ]);

  const handleAcceptMatch = (id: string) => {
    setMatches(
      matches.map((m) => (m.id === id ? { ...m, status: "scheduled" } : m))
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-extrabold text-xs border border-cyan-500/30 mb-2">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>Cross-Audience Virality Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Weekly Creator Matchmaking
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
            We automatically pair you with larger creators in complementary niches to cross-pollinate audiences and boost organic follower growth.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-right min-w-[200px]">
          <div className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Match Frequency</div>
          <div className="text-2xl font-black text-cyan-300">
            {user?.package === "CREATOR LITE" ? "Every 15 Days" : "Every 7 Days"}
          </div>
          <div className="text-[11px] text-slate-300 font-medium">Included in {user?.package || "CREATOR PLUS"}</div>
        </div>
      </div>

      {/* Active Match Cards */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="font-extrabold text-slate-900 text-base">
            Your Matchmaking Opportunities
          </h3>
          <span className="text-xs text-indigo-600 font-bold">Week 4 Active Match</span>
        </div>

        <div className="space-y-4">
          {matches.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-cyan-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-200 shadow-md shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-slate-900 text-base">{item.name}</h4>
                    <span className="text-xs font-bold text-indigo-600">{item.handle}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-700 font-bold text-[10px] border border-cyan-100">
                      {item.subscribers}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-700 mt-1">
                    Proposed Collab: <span className="text-indigo-900">{item.proposedFormat}</span>
                  </p>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex items-center gap-3">
                {item.status === "completed" ? (
                  <span className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Collab Published (+4.2k Growth)
                  </span>
                ) : item.status === "scheduled" ? (
                  <span className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-xs border border-indigo-200 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-indigo-600" /> Scheduled for Friday
                  </span>
                ) : (
                  <button
                    onClick={() => handleAcceptMatch(item.id)}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    Accept Match & Connect
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
