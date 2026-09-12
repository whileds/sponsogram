"use client";

import React, { useState } from "react";
import { Gift, Camera, Megaphone, Coffee, CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function PerksPage() {
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState<"gear" | "pr" | "cafe">("gear");
  const [requestSuccess, setRequestSuccess] = useState(false);

  const handleBookPerk = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestSuccess(true);
    setTimeout(() => setRequestSuccess(false), 4000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-extrabold text-xs border border-purple-500/30 mb-2">
            <Gift className="w-3.5 h-3.5 text-purple-300" />
            <span>Future Ecosystem Perks & Equipment</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Creator Gear Kit, PR & Cafe Perks
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
            Order physical studio gear kits, request major press features, and reserve physical Sponsogram Content Creation Cafe spaces.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-right min-w-[200px]">
          <div className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Perks Eligibility</div>
          <div className="text-xl font-black text-amber-300">Cohort #4 VIP Access</div>
          <div className="text-[11px] text-slate-300 font-medium">Included in {user?.package || "CREATOR PLUS"}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <button
          onClick={() => setActiveTab("gear")}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
            activeTab === "gear"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Content Creation Gear Kit</span>
        </button>

        <button
          onClick={() => setActiveTab("pr")}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
            activeTab === "pr"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>Dedicated PR & Media Team</span>
        </button>

        <button
          onClick={() => setActiveTab("cafe")}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
            activeTab === "cafe"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Coffee className="w-4 h-4" />
          <span>Content Creation Cafe Studios</span>
        </button>
      </div>

      {requestSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold text-center animate-fade-in flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Request logged! Your personal manager will confirm your dispatch details within 24 hours.</span>
        </div>
      )}

      {/* Tab 1: Gear Kit */}
      {activeTab === "gear" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg">Pro 4K Camera Bundle</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Sony ZV-E10 4K Camera + 16-50mm Lens + Heavy Duty Tripod shipped directly to your studio.
              </p>
            </div>
            <button
              onClick={handleBookPerk}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-colors"
            >
              Request Camera Kit
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                <Sparkles className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg">Wireless Mic & Audio Set</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Rode Wireless GO II Dual Channel Mics + Lavalier Clips for crystal clear voiceover recording.
              </p>
            </div>
            <button
              onClick={handleBookPerk}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-colors"
            >
              Request Audio Kit
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                <Gift className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg">Elgato Key Light Duo</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Dual softbox lighting setup with app-controlled color temperature for professional studio lighting.
              </p>
            </div>
            <button
              onClick={handleBookPerk}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-colors"
            >
              Request Studio Light Kit
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Dedicated PR Team */}
      {activeTab === "pr" && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs max-w-2xl space-y-6">
          <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-indigo-600" />
            Submit Press & Media Placement Request
          </h3>
          <p className="text-slate-600 text-xs leading-relaxed">
            Our PR team pitches your creator profile for interviews and features on Forbes, TechCrunch, and top podcasts.
          </p>

          <form onSubmit={handleBookPerk} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Target Publication / Media Type
              </label>
              <select className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="Tech & Business Press">Tech & Business Press (Forbes, TechCrunch)</option>
                <option value="Top Niche Podcasts">Top Niche Podcasts Guest Feature</option>
                <option value="Press Release Distribution">Press Release & Media Distribution</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Channel Angle / Story Highlight *
              </label>
              <textarea
                rows={3}
                required
                placeholder="e.g. How I grew my channel to 200k subscribers in 6 months using Sponsogram AI..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-colors"
            >
              Submit PR Pitch Request
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Content Creation Cafe */}
      {activeTab === "cafe" && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs max-w-2xl space-y-6">
          <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
            <Coffee className="w-5 h-5 text-indigo-600" />
            Reserve Content Creation Cafe Studio
          </h3>
          <p className="text-slate-600 text-xs leading-relaxed">
            Book physical podcast rooms, high-end video sets, and co-working spaces at Sponsogram Cafe hubs.
          </p>

          <form onSubmit={handleBookPerk} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Select Location Hub
                </label>
                <select className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="Bengaluru Tech Hub">Bengaluru Tech Hub Cafe</option>
                  <option value="Mumbai Creator Studio">Mumbai Creator Studio</option>
                  <option value="Delhi NCR Hub">Delhi NCR Podcast Lounge</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Studio Room Type
                </label>
                <select className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="Podcast Studio Room">Podcast Studio (4 Microphones)</option>
                  <option value="4K Video Set">4K Video Set with Lighting</option>
                  <option value="Creator Coworking Desk">Creator Coworking Lounge Desk</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-colors"
            >
              Reserve Cafe Studio Pass
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
