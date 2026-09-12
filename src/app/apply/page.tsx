"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Rocket, Sparkles, ArrowRight, ShieldCheck, Lock, AlertCircle, Upload } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const PLAN_TIER_MAP: Record<string, string> = {
  "CREATOR LITE": "CREATOR_LITE",
  "CREATOR PLUS": "CREATOR_PLUS",
  "CREATOR PREMIUM": "CREATOR_PREMIUM",
};

export default function ApplyPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    socialHandle: "",
    platform: "YouTube & Instagram",
    niche: "Tech & AI",
    followerCount: "1k - 10k",
    packageChoice: "CREATOR PLUS",
    primaryGoal: "",
    monthlyReelCount: "8 - 12 Reels",
    profilePhoto: null as File | null,
  });

  const handleCompleteSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const submitData = new FormData();

submitData.append("fullName", formData.fullName);
submitData.append("email", formData.email);
submitData.append("password", formData.password);
submitData.append("confirmPassword", formData.confirmPassword);
submitData.append("socialHandle", formData.socialHandle);
submitData.append("platform", formData.platform);
submitData.append("niche", formData.niche);
submitData.append("followerCount", formData.followerCount);
submitData.append(
  "requestedPlan",
  PLAN_TIER_MAP[formData.packageChoice]
);
submitData.append("primaryGoal", formData.primaryGoal);

if (formData.profilePhoto) {
  submitData.append("profilePhoto", formData.profilePhoto);
}

const res = await fetch("/api/auth/register", {
  method: "POST",
  body: submitData,
});

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setIsSubmitting(false);
        return;
      }

      // Registration succeeded — sign the creator in immediately so /status
      // can read their real application from the backend.
      const loginResult = await login(formData.email, formData.password);
      if (!loginResult.ok) {
        // Application was still created; they can just log in manually.
        router.push("/login");
        return;
      }

      router.push("/status");
    } catch {
      setError("Network error. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Glow Orbs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Header Bar */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between mb-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
            <Rocket className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-900">
            Sponsogram <span className="text-indigo-600 text-xs px-2 py-0.5 rounded bg-indigo-50 font-bold border border-indigo-200">OS</span>
          </span>
        </Link>
        <Link
          href="/login"
          className="text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          Already Applied? Log In
        </Link>
      </div>

      {/* Main Container */}
      <div className="max-w-2xl mx-auto w-full bg-white rounded-3xl border border-slate-200/80 shadow-xl p-6 sm:p-10 my-auto">
        
        {/* Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-3 border border-indigo-100">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Incubation Cohort #4 Official Application</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Apply For Sponsogram Incubation
          </h1>
          <p className="text-slate-500 text-xs mt-1 font-medium">
            Fill out your details below to get evaluated for video editing & dedicated manager allocation.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
              step >= 1 ? "bg-indigo-600 text-white shadow-sm" : "bg-slate-100 text-slate-400"
            }`}>
              1
            </div>
            <span className="text-xs font-bold text-slate-700">Creator Details</span>
          </div>
          <div className="h-0.5 flex-1 mx-4 bg-slate-200"></div>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
              step >= 2 ? "bg-indigo-600 text-white shadow-sm" : "bg-slate-100 text-slate-400"
            }`}>
              2
            </div>
            <span className="text-xs font-bold text-slate-700">Package & Niche</span>
          </div>
          <div className="h-0.5 flex-1 mx-4 bg-slate-200"></div>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
              step === 3 ? "bg-indigo-600 text-white shadow-sm" : "bg-slate-100 text-slate-400"
            }`}>
              3
            </div>
            <span className="text-xs font-bold text-slate-700">Goals & Submit</span>
          </div>
        </div>

        <form onSubmit={handleCompleteSubmission}>
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rohan Verma"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
  <label className="block text-xs font-bold text-slate-700 mb-1.5">
    Profile Photo *
  </label>

  <div className="flex items-center gap-4">
    <label className="flex-1 cursor-pointer rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 hover:border-indigo-500 transition">
      <div className="flex items-center gap-3">
        <Upload className="w-5 h-5 text-indigo-600" />
        <div>
          <p className="text-sm font-semibold text-slate-700">
            {formData.profilePhoto
              ? formData.profilePhoto.name
              : "Choose your profile photo"}
          </p>
          <p className="text-[11px] text-slate-400">
            PNG, JPG or WEBP
          </p>
        </div>
      </div>

      <input
        type="file"
        accept="image/png,image/jpeg,image/webp"
        required
        className="hidden"
        onChange={(e) =>
          setFormData({
            ...formData,
            profilePhoto: e.target.files?.[0] ?? null,
          })
        }
      />
    </label>
  </div>
</div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="rohan@creator.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Primary Platform
                  </label>
                  <select
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="YouTube & Instagram">YouTube & Instagram</option>
                    <option value="Instagram Reels Only">Instagram Reels Only</option>
                    <option value="YouTube Shorts & Long">YouTube Shorts & Long</option>
                    <option value="TikTok & Multi-platform">TikTok & Multi-platform</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Channel Handle / Link *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="@rohan_tech"
                    value={formData.socialHandle}
                    onChange={(e) => setFormData({ ...formData, socialHandle: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="password"
                      required
                      minLength={8}
                      placeholder="At least 8 characters"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-3.5 mt-4 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-md hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
              >
                <span>Proceed to Step 2</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Content Niche
                </label>
                <select
                  value={formData.niche}
                  onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Tech & AI">Tech, AI & Software</option>
                  <option value="Personal Finance">Personal Finance & Business</option>
                  <option value="Lifestyle & Fitness">Lifestyle & Fitness</option>
                  <option value="Gaming & Entertainment">Gaming & Entertainment</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Current Audience Size
                </label>
                <select
                  value={formData.followerCount}
                  onChange={(e) => setFormData({ ...formData, followerCount: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="1k - 10k">1k - 10k Followers</option>
                  <option value="10k - 50k">10k - 50k Followers</option>
                  <option value="50k - 200k">50k - 200k Followers</option>
                  <option value="200k+">200k+ Followers</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Select Incubation Package
                </label>
                <select
                  value={formData.packageChoice}
                  onChange={(e) => setFormData({ ...formData, packageChoice: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-indigo-200 bg-indigo-50/50 text-indigo-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="CREATOR LITE">CREATOR LITE ($199/mo) - 100 Credits & Editing</option>
                  <option value="CREATOR PLUS">CREATOR PLUS ($399/mo) - Personal Manager & Unlimited Toolkit</option>
                  <option value="CREATOR PREMIUM">CREATOR PREMIUM ($799/mo) - VIP Guaranteed Deals</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-3.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="w-2/3 py-3.5 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-md hover:bg-indigo-700 flex items-center justify-center gap-2"
                >
                  <span>Proceed to Final Step</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  What is your primary growth goal for the next 90 days? *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.primaryGoal}
                  onChange={(e) => setFormData({ ...formData, primaryGoal: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-indigo-900">
                  <span>Selected Package:</span>
                  <span className="bg-indigo-600 text-white px-2.5 py-0.5 rounded-md">{formData.packageChoice}</span>
                </div>
                <div className="text-[11px] text-slate-600 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Guaranteed evaluation within 24 hours by your assigned Personal Manager.
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-600">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/3 py-3.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-2/3 py-3.5 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-md hover:bg-indigo-700 flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  {isSubmitting ? "Submitting…" : "Submit Application & View Status"}
                </button>
              </div>
            </div>
          )}
        </form>

      </div>

      {/* Footer text */}
      <div className="text-center text-xs text-slate-400 font-medium mt-8">
        © 2026 Sponsogram Inc incubation Engine. All application data is kept strictly confidential.
      </div>
    </div>
  );
}
