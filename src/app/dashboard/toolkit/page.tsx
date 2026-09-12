"use client";

import React, { useEffect, useState } from "react";
import { Wrench, Sparkles, Zap, Copy, Check, TrendingUp, Hash, RefreshCw, FileText } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function ToolkitPage() {
  const { user } = useAuth();
const [credits, setCredits] = useState<{
  used: number;
  limit: number | null;
  remaining: number | null;
  unlimited: boolean;
}>({
  used: 0,
  limit: 0,
  remaining: 0,
  unlimited: false,
});
  useEffect(() => {
  fetch("/api/toolkit/usage")
    .then((res) => res.json())
    .then((data) => setCredits(data))
    .catch((err) => console.error("Failed to load toolkit credits:", err));
}, []);
  const [activeTool, setActiveTool] = useState<"script" | "hook" | "hashtags">("script");
  
  // AI Script Generator State
  const [topic, setTopic] = useState("10 Mind-Blowing AI Tools You Didn't Know Existed");
  const [tone, setTone] = useState("High Energy & Hype");
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);
  const [isGenerating,   setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hashtagTopic, setHashtagTopic] = useState("");
const [generatedHashtags, setGeneratedHashtags] = useState<string[]>([]);
const [isGeneratingHashtags, setIsGeneratingHashtags] = useState(false);

  // Hook Predictor State
  const [hookTitle, setHookTitle] = useState("Stop Using ChatGPT Until You Watch This Video!");
  const [hookScore, setHookScore] = useState<number | null>(94);

  const handleGenerateScript = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsGenerating(true);
  setGeneratedScript(null);

  try {
    const response = await fetch("/api/toolkit/script", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic,
        tone,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to generate script");
    }

    setGeneratedScript(data.script);
  } catch (error) {
    console.error(error);
    alert(error instanceof Error ? error.message : "Something went wrong");
  } finally {
    setIsGenerating(false);
  }
};
  const handlePredictVirality = async () => {
  if (!hookTitle.trim()) return;

  try {
    const response = await fetch("/api/toolkit/virality", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ hookTitle }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to predict virality");
    }

    setHookScore(data.score);
  } catch (error) {
    console.error(error);
    alert(error instanceof Error ? error.message : "Something went wrong");
  }
};
const handleGenerateHashtags = async () => {
  if (!hashtagTopic.trim()) return;

  setIsGeneratingHashtags(true);

  try {
    const response = await fetch("/api/toolkit/hashtags", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic: hashtagTopic,
        niche: user?.niche || "",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to generate hashtags");
    }

    setGeneratedHashtags(data.hashtags);
  } catch (error) {
    console.error(error);
    alert(
      error instanceof Error ? error.message : "Something went wrong"
    );
  } finally {
    setIsGeneratingHashtags(false);
  }
};
  const handleCopyScript = () => {
    if (generatedScript) {
      navigator.clipboard.writeText(generatedScript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-purple-900 via-slate-900 to-indigo-950 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-extrabold text-xs border border-purple-500/30 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Sponsogram AI Toolkit v3.0</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Creator AI Tools & Script Suite
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
            Generate high-retention reel scripts, calculate hook virality scores, and auto-format hashtags.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-right min-w-[200px]">
          <div className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Your Credit Balance</div>
          <div className="text-2xl font-black text-amber-300">
            {credits.unlimited
  ? "UNLIMITED"
  : `${credits.remaining} / ${credits.limit} Credits`}
          </div>
          <div className="text-[11px] text-slate-300 font-medium">Included in {user?.package || "CREATOR PLUS"}</div>
        </div>
      </div>

      {/* Tool Selector Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <button
          onClick={() => setActiveTool("script")}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
            activeTool === "script"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>AI Script & Hook Generator</span>
        </button>

        <button
          onClick={() => setActiveTool("hook")}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
            activeTool === "hook"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Virality Score Predictor</span>
        </button>

        <button
          onClick={() => setActiveTool("hashtags")}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
            activeTool === "hashtags"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Hash className="w-4 h-4" />
          <span>Auto Captions & Hashtags</span>
        </button>
      </div>

      {/* Tool 1: AI Script Generator */}
      {activeTool === "script" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Configure Script Parameters
            </h3>

            <form onSubmit={handleGenerateScript} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Video Topic or Main Keyword *
                </label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Desired Content Tone & Style
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                >
                  <option value="High Energy & Hype">High Energy & Hype (Reels / Shorts)</option>
                  <option value="Educational & Authoritative">Educational & Authoritative</option>
                  <option value="Storytelling & Casual">Storytelling & Casual Vlog</option>
                  <option value="Controversial & Pattern Interrupt">Controversial & Pattern Interrupt</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                    <span>Analyzing Virality Patterns...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Generate AI Script (1 Credit)</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Generated Script Display */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">
                Generated High-Retention Script
              </h3>
              {generatedScript && (
                <button
                  onClick={handleCopyScript}
                  className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-600 font-bold text-xs flex items-center gap-1.5 hover:bg-indigo-100"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied!" : "Copy Script"}</span>
                </button>
              )}
            </div>

            {generatedScript ? (
              <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed whitespace-pre-wrap min-h-[220px]">
                {generatedScript}
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80 text-center text-slate-400 text-xs space-y-2 min-h-[220px] flex flex-col items-center justify-center">
                <FileText className="w-8 h-8 text-slate-300" />
                <p className="font-medium">Enter your video topic and click Generate AI Script.</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Tool 2: Virality Predictor */}
      {activeTool === "hook" && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs max-w-2xl space-y-6">
          <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            Test Reel Title & Hook Virality Score
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Reel Title / Hook Line
              </label>
              <input
                type="text"
                value={hookTitle}
                onChange={(e) => {
                  setHookTitle(e.target.value);
                  setHookScore(null);
                }}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
              />
              <button
  type="button"
  onClick={handlePredictVirality}
  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all"
>
  Predict Virality Score
</button>
            </div>

            {hookScore !== null && (
              <div className="p-6 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                    Predicted Virality Score
                  </div>
                  <div className="text-4xl font-black text-indigo-600 mt-1">
                    {hookScore} / 100
                  </div>
                  <p className="text-xs text-slate-600 mt-1 font-medium">
                    Strong curiosity gap detected. High watch-time potential.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500 text-white font-extrabold text-xs shadow-sm">
                  High Viral Potential
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tool 3: Hashtags Generator */}
      {activeTool === "hashtags" && (
  <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs max-w-2xl space-y-5">
    <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
      <Hash className="w-5 h-5 text-indigo-600" />
      Niche Auto-Hashtag Generator
    </h3>

    <div>
      <label className="block text-xs font-bold text-slate-700 mb-1.5">
        What is your content about?
      </label>

      <input
        type="text"
        value={hashtagTopic}
        onChange={(e) => setHashtagTopic(e.target.value)}
        placeholder="e.g. AI tools for students"
        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>

    <button
      type="button"
      onClick={handleGenerateHashtags}
      disabled={isGeneratingHashtags || !hashtagTopic.trim()}
      className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
    >
      {isGeneratingHashtags ? (
        <>
          <RefreshCw className="w-4 h-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Hash className="w-4 h-4" />
          Generate Hashtags
        </>
      )}
    </button>

    {generatedHashtags.length > 0 && (
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
        <p className="font-bold text-slate-900 text-sm mb-3">
          Suggested Hashtags
        </p>

        <div className="flex flex-wrap gap-2">
          {generatedHashtags.map((hashtag) => (
            <span
              key={hashtag}
              className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold"
            >
              {hashtag}
            </span>
          ))}
        </div>
      </div>
    )}
  </div>
)}

    </div>
  );
}
