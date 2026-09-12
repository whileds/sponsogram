"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wrench,
  Video,
  Lightbulb,
  Briefcase,
  Users,
  Calendar,
  LogOut,
  Rocket,
  UserCheck,
  Bell,
  Sparkles,
  Gift,
  ShieldAlert,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    {
      name: "Dashboard Overview",
      href: "/dashboard",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      name: "Video Editing Pipeline",
      href: "/dashboard/editing",
      icon: Video,
      badge: "2 Active",
    },
    {
      name: "Sponsogram AI Toolkit",
      href: "/dashboard/toolkit",
      icon: Wrench,
      badge: "Unlimited",
    },
    {
      name: "Content Strategy & Hooks",
      href: "/dashboard/strategy",
      icon: Lightbulb,
      badge: "New",
    },
    {
      name: "Brand Collaboration Board",
      href: "/dashboard/brands",
      icon: Briefcase,
      badge: "3 Deals",
    },
    {
      name: "Creator Matchmaking",
      href: "/dashboard/matchmaking",
      icon: Users,
      badge: "Weekly",
    },
    {
      name: "Mentorship Scheduler",
      href: "/dashboard/mentorship",
      icon: Calendar,
      badge: "15-Day",
    },
    {
      name: "Gear Kit, PR & Cafe Perks",
      href: "/dashboard/perks",
      icon: Gift,
      badge: "Future",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Desktop Sidebar Navigation */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200/80 flex-col justify-between p-6 shrink-0">
        <div>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
              <Rocket className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-slate-900">
                Sponsogram <span className="text-indigo-600 text-[10px] px-1.5 py-0.5 rounded bg-indigo-50 font-bold border border-indigo-200">OS</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Creator Incubator
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider px-3 mb-2">
              Incubation Suite
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-indigo-50 text-indigo-700 border border-indigo-100"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer User Info & Admin Link */}
        <div className="pt-4 border-t border-slate-100 mt-4 space-y-3">
          <Link
            href="/admin"
            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm"
          >
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Admin Control Portal</span>
            </div>
            <span className="text-[10px] bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded font-extrabold">
              Staff
            </span>
          </Link>

          <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100">
            <div className="flex items-center justify-between text-xs font-bold text-indigo-900 mb-1">
              <span>{user?.package || "CREATOR PLUS"}</span>
              <span className="text-emerald-600 text-[10px] font-extrabold">Active</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Manager: <strong className="text-slate-800">{user?.assignedManager?.name || "Ananya S."}</strong>
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                alt="Creator Avatar"
                className="w-8 h-8 rounded-full object-cover border border-slate-200"
              />
              <div className="text-left">
                <div className="text-xs font-bold text-slate-900">{user?.name || "Rohan Verma"}</div>
                <div className="text-[10px] text-slate-400 font-medium">{user?.socialHandle || "@rohan_tech"}</div>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar for Desktop & Mobile */}
        <header className="bg-white border-b border-slate-200/80 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Drawer Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link href="/" className="md:hidden flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-xs">
                <Rocket className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-sm text-slate-900">
                Sponsogram <span className="text-indigo-600 text-[10px]">OS</span>
              </span>
            </Link>

            <span className="hidden sm:inline-flex px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-extrabold text-xs border border-emerald-200 items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Cohort #4 Incubated
            </span>
          </div>

          <div className="flex items-center gap-3 relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-600"></span>
            </button>

            {/* Notification Dropdown */}
            {notificationsOpen && (
              <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl p-4 z-50 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                  <h4 className="font-bold text-xs text-slate-900">Incubation Notifications</h4>
                  <span className="text-[10px] text-indigo-600 font-bold">2 New</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-100">
                    <p className="font-bold text-indigo-950">New Brand Sponsorship Match</p>
                    <p className="text-[11px] text-slate-600 mt-0.5">Notion matched with your channel for a $2,500 Reel deal.</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="font-bold text-slate-900">Weekly Creator Matchmaking</p>
                    <p className="text-[11px] text-slate-600 mt-0.5">Matched with @priya_finance (180k) for a co-scripted reel.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Mobile Navigation Drawer Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-3 shadow-xl z-20">
            <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider px-2">
              Incubation Suite Navigation
            </div>
            <div className="grid grid-cols-1 gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-500"}`} />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-indigo-50 text-indigo-700 border border-indigo-100"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs mt-2"
              >
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Admin Control Portal</span>
              </Link>
            </div>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
