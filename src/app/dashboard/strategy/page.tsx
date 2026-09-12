"use client";
import React, { useEffect, useState } from "react";
import { Lightbulb, Sparkles, TrendingUp, Calendar, CheckCircle2, UserCheck, Copy, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function StrategyHubPage() {
  const { user } = useAuth();
  const [strategyData, setStrategyData] = useState<any>(null);
const [isLoadingStrategy, setIsLoadingStrategy] = useState(true);

useEffect(() => {
  fetch("/api/strategy")
    .then((res) => res.json())
    .then((data) => setStrategyData(data))
    .catch((err) => console.error("Failed to load strategy:", err))
    .finally(() => setIsLoadingStrategy(false));
}, []);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // const trendingStrategies = [];

  const handleCopyHook = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-extrabold text-xs border border-amber-500/30 mb-2">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Curated Virality Repository</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Content Strategy & Niche Virality Hub
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
            Pre-tested reel scripts, hook frameworks, and bi-weekly performance notes from your personal manager.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-right min-w-[200px]">
          <div className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Next 15-Day Strategy Session</div>
          <div className="text-lg font-black text-amber-300 mt-0.5">{strategyData?.session
  ? `${strategyData.session.day} at ${strategyData.session.time}`
  : "Loading..."}</div>
          <div className="text-[11px] text-slate-300 font-medium">With {strategyData?.manager?.name || "Loading..."}</div>
        </div>
      </div>

      {/* Bi-Weekly Reel Evaluation Notes */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">
              Latest Reel Performance Notes from {user?.assignedManager?.name || "Ananya"}
            </h3>
            <p className="text-xs text-slate-500">Evaluated on {strategyData?.feedback?.evaluatedOn || "Loading..."}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-950 space-y-2">
          <p className="font-bold text-indigo-900">📌 Manager Recommendation & Feedback:</p>
        <p className="leading-relaxed">
  &quot;
  {strategyData?.feedback?.note || "Loading manager feedback..."}
  &quot;
</p>
        </div>
      </div>

      {/* Recommended Viral Hooks */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="font-extrabold text-slate-900 text-base">
            Recommended Trending Scripts for {user?.niche || "Tech & AI"}
          </h3>
          <span className="text-xs text-indigo-600 font-bold">Updated Today</span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {strategyData?.strategies?.map((strat: any) => (
            <div
              key={strat.id}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-sm">{strat.title}</h4>
                  <span className="px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold text-[10px] border border-indigo-100">
                    {strat.niche}
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                    {strat.viewsPotential}
                  </span>
                </div>
                <p className="text-xs font-mono text-slate-700 bg-white p-3 rounded-xl border border-slate-200">
                  &quot;{strat.hookText}&quot;
                </p>
                <p className="text-[11px] text-slate-500 font-medium">
                  <strong>Why it works:</strong> {strat.viralityReason}
                </p>
              </div>

              <button
                onClick={() => handleCopyHook(strat.id, strat.hookText)}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5 whitespace-nowrap self-stretch md:self-auto justify-center"
              >
                {copiedId === strat.id ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === strat.id ? "Copied!" : "Use Script Hook"}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
