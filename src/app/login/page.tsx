"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Rocket, ArrowRight, Lock, Mail, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<
  "creator" | "manager" | "mentor" | "admin" | "editor"
>("creator");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await login(email, password);
    setIsSubmitting(false);

    if (!result.ok) {
      setError(result.error ?? "Login failed. Please try again.");
      return;
    }

    // Route by the server-verified session role, not the tab the user
    // happened to click — the tab is just framing copy.
    const res = await fetch("/api/auth/session");
    const session = await res.json();
    const actualRole = session?.user?.role as string | undefined;

  if (actualRole === "CREATOR") {
  router.push("/dashboard");
} else if (actualRole === "EDITOR") {
  router.push("/editor");
} else {
  router.push("/admin");
}
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Glow Orbs */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl -z-10 pointer-events-none" />

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
          href="/apply"
          className="text-xs font-bold text-indigo-600 hover:underline"
        >
          New Creator? Apply Here
        </Link>
      </div>

      {/* Main Container */}
      <div className="max-w-md mx-auto w-full bg-white rounded-3xl border border-slate-200/80 shadow-xl p-6 sm:p-8 my-auto">

        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Creator & Staff Portal
          </h1>
          <p className="text-slate-500 text-xs mt-1 font-medium">
            Log in to manage your incubation status, video editing queue, and brand deals.
          </p>
        </div>

        {/* Role Switcher (informational — your actual account role decides where you land) */}
        <div className="p-1 rounded-xl bg-slate-100 border border-slate-200 mb-6 flex">
          <button
            type="button"
            onClick={() => setRole("creator")}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
              role === "creator"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Creator
          </button>
          <button
            type="button"
            onClick={() => setRole("manager")}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
              role === "manager"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Manager
          </button>
          <button
  type="button"
  onClick={() => setRole("editor")}
  className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
    role === "editor"
      ? "bg-slate-900 text-white shadow-sm"
      : "text-slate-500 hover:text-slate-900"
  }`}
>
  Editor
</button>
          <button
            type="button"
            onClick={() => setRole("mentor")}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
              role === "mentor"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Mentor
          </button>
          <button
  type="button"
  onClick={() => setRole("admin")}
  className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
    role === "admin"
      ? "bg-slate-900 text-white shadow-sm"
      : "text-slate-500 hover:text-slate-900"
  }`}
>
  Admin
</button>
        </div>

        {error && (
          <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-600">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Password
              </label>
              <a href="#" className="text-[11px] text-indigo-600 font-medium hover:underline">Forgot?</a>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3.5 rounded-xl text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-60 ${
              role === "creator" ? "bg-indigo-600 hover:bg-indigo-700" : "bg-slate-900 hover:bg-slate-800"
            }`}
          >
            <span>{isSubmitting ? "Logging in…" : "Log In"}</span>
            {!isSubmitting && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <span>Check application progress?</span>
          <Link href="/status" className="text-indigo-600 font-bold hover:underline">
            View Application Status →
          </Link>
        </div>

      </div>

      <div className="text-center text-xs text-slate-400 font-medium">
        Need help? Contact <a href="#" className="text-indigo-600">support@sponsogram.com</a>
      </div>
    </div>
  );
}
