"use client";

import React, { useState } from "react";
import { Calendar, Award, UserCheck, Clock, CheckCircle2, Video, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function MentorshipPage() {
  const { user } = useAuth();
  
  const [scheduledCalls, setScheduledCalls] = useState([
    {
      id: "call-1",
      title: "15-Day Virality Strategy Session",
      mentor: "Ananya Sharma (Senior Growth Manager)",
      date: "Friday, July 25, 2026",
      time: "4:00 PM EST",
      type: "Bi-Weekly Strategy",
      status: "Confirmed",
    },
    {
      id: "call-2",
      title: "1-on-1 Niche Creator Masterclass",
      mentor: "Karan Johar (Tech Creator • 1.2M Subs)",
      date: "August 3, 2026",
      time: "6:30 PM EST",
      type: "Exclusive Creator Consultation",
      status: "Upcoming",
    },
  ]);

  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleBookSession = () => {
    setBookingSuccess(true);
    setTimeout(() => setBookingSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-violet-950 via-slate-900 to-indigo-950 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 font-extrabold text-xs border border-violet-500/30 mb-2">
            <Award className="w-3.5 h-3.5 text-violet-300" />
            <span>Top 1% Creator Advisory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Mentorship & Virality Consultations
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
            Schedule your bi-weekly virality strategy session or book 1-on-1 consultations with exclusive creators in your niche.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-right min-w-[200px]">
          <div className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Next Session</div>
          <div className="text-xl font-black text-violet-300">July 25 @ 4 PM</div>
          <div className="text-[11px] text-slate-300 font-medium">15-Day Virality Call</div>
        </div>
      </div>

      {/* Available Mentorship Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Option 1 */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">
              15-Day Strategy & Virality Session
            </h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Bi-weekly strategy call with the Sponsogram Team to review subscriber targets, re-evaluate reel hooks, and optimize monetization.
            </p>
          </div>

          <button
            onClick={handleBookSession}
            className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
          >
            <Video className="w-4 h-4" />
            Schedule 15-Day Strategy Call
          </button>
        </div>

        {/* Option 2 */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">
              Exclusive Niche Creator Consultation
            </h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Get direct 1-on-1 advice from verified creators (1M+ followers) in {user?.niche || "Tech & AI"} to refine your brand positioning.
            </p>
          </div>

          <button
            onClick={handleBookSession}
            className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
          >
            <Video className="w-4 h-4 text-amber-400" />
            Book Exclusive Creator Call
          </button>
        </div>

      </div>

      {bookingSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold text-center animate-fade-in">
          🎉 Session slot reserved! Calendar invite sent to your email.
        </div>
      )}

      {/* Scheduled Calls List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
        <h3 className="font-extrabold text-slate-900 text-base">
          Upcoming Scheduled Sessions ({scheduledCalls.length})
        </h3>

        <div className="space-y-3">
          {scheduledCalls.map((call) => (
            <div
              key={call.id}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center font-bold">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{call.title}</h4>
                  <p className="text-xs text-slate-500 font-medium">With: <span className="text-slate-800 font-semibold">{call.mentor}</span></p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-900">{call.date}</div>
                  <div className="text-[11px] text-slate-500 font-medium">{call.time}</div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
                  {call.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
