"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Users,
  Video,
  CheckCircle2,
  XCircle,
  UserPlus,
  Briefcase,
  Search,
  Sparkles,
  Rocket,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

interface Applicant {
  id: string;
  name: string;
  email: string;
  socialHandle: string;
  niche: string;
  followers: string;
  packageChoice: string;
  status: "pending" | "approved" | "rejected";
  assignedManager: string;
  assignedManagerId: string;
}

export default function AdminPage() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const [editingCount, setEditingCount] = useState(0);
const [managers, setManagers] = useState<
  { id: string; name: string; email: string; title: string | null }[]
>([]);

useEffect(() => {
  const loadData = async () => {
    try {
      const editingRes = await fetch("/api/admin/editing");

if (!editingRes.ok) {
  throw new Error("Failed to load editing queue");
}

const editingData = await editingRes.json();
setEditingCount(editingData.length);
      // Load applications
      const res = await fetch("/api/admin/applications");

      if (!res.ok) {
        throw new Error("Failed to load applications");
      }

      const data = await res.json();
      setApplicants(data);

      // Load managers
      const managerRes = await fetch("/api/admin/managers");

      if (!managerRes.ok) {
        throw new Error("Failed to load managers");
      }

      const managerData = await managerRes.json();
      setManagers(managerData);

    } catch (err) {
      console.error(err);
      setError("Unable to load admin data.");
    } finally {
      setLoading(false);
    }
  };

  loadData();
}, []);

 const handleApprove = async (id: string) => {
  const res = await fetch("/api/admin/applications", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      status: "APPROVED",
    }),
  });

  if (!res.ok) {
    setError("Failed to approve application.");
    return;
  }

  setApplicants((current) =>
    current.map((a) =>
      a.id === id ? { ...a, status: "approved" } : a
    )
  );
};

  const handleReject = async (id: string) => {
  const res = await fetch("/api/admin/applications", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      status: "REJECTED",
    }),
  });

  if (!res.ok) {
    setError("Failed to reject application.");
    return;
  }

  setApplicants((current) =>
    current.map((a) =>
      a.id === id ? { ...a, status: "rejected" } : a
    )
  );
};

  const handleManagerChange = async (id: string, managerId: string) => {
  try {
    const res = await fetch("/api/admin/applications", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        managerId,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to assign manager");
    }

    const selectedManager = managers.find(
      (manager) => manager.id === managerId
    );

    setApplicants((prev) =>
      prev.map((app) =>
        app.id === id
          ? {
              ...app,
              assignedManagerId: managerId,
              assignedManager: selectedManager?.name ?? "",
            }
          : app
      )
    );
  } catch (err) {
    console.error(err);
    setError("Unable to assign manager.");
  }
};

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Admin Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
              <Rocket className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight text-white">
                Sponsogram <span className="text-amber-400 text-xs px-2 py-0.5 rounded bg-slate-800 font-bold border border-slate-700">ADMIN</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Staff Operations Portal
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-colors"
            >
              Go to Creator Portal
            </Link>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">

  {error && (
    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
      {error}
    </div>
  )}

  {/* Admin Overview Metrics */}
        
        {/* Admin Overview Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase mb-2">
              <span>Incubated Creators</span>
              <Users className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900">512</div>
            <div className="text-xs text-emerald-600 font-bold mt-1">+18 This Month</div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase mb-2">
              <span>Pending Applications</span>
              <ShieldAlert className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-3xl font-extrabold text-amber-600">
              {applicants.filter((a) => a.status === "pending").length} Pending
            </div>
            <div className="text-xs text-slate-500 font-medium mt-1">Requires Manager Audit</div>
          </div>

          <Link
  href="/admin/editing"
  className="block bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer"
>
  <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase mb-2">
    <span>Active Video Edits</span>
    <Video className="w-4 h-4 text-indigo-600" />
  </div>

  <div className="text-3xl font-extrabold text-slate-900">
    {editingCount} Queue
  </div>

  <div className="text-xs text-indigo-600 font-bold mt-1">
    Editing Queue →
  </div>
</Link>
<Link
  href="/admin/brand-applications"
  className="block bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer"
>
  <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase mb-2">
    <span>Brand Applications</span>
    <Briefcase className="w-4 h-4 text-emerald-600" />
  </div>

  <div className="text-3xl font-extrabold text-slate-900">
    Review
  </div>

  <div className="text-xs text-emerald-600 font-bold mt-1">
    View Brand Applications →
  </div>
</Link>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase mb-2">
              <span>Brand Revenue Facilitated</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900">$124.5K</div>
            <div className="text-xs text-emerald-600 font-bold mt-1">100% Escrow Protected</div>
          </div>
        </div>

        {/* Applicant Evaluation Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">
                Creator Application Approvals (Cohort #4)
              </h3>
              <p className="text-xs text-slate-500">
                Review applicant channels, assign Personal Managers, and grant incubation access.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs border border-indigo-200">
              Staff Operations
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3 px-2">Creator Name</th>
                  <th className="pb-3 px-2">Niche & Handle</th>
                  <th className="pb-3 px-2">Package Choice</th>
                  <th className="pb-3 px-2">Assigned Manager</th>
                  <th className="pb-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applicants.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-2">
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <div className="text-[11px] text-slate-500">{item.email}</div>
                    </td>

                    <td className="py-4 px-2">
                      <div className="font-bold text-indigo-600">{item.socialHandle}</div>
                      <div className="text-[11px] text-slate-500">{item.niche} • {item.followers}</div>
                    </td>

                    <td className="py-4 px-2">
                      <span className="px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 font-bold text-[10px] border border-indigo-100">
                        {item.packageChoice}
                      </span>
                    </td>

                    <td className="py-4 px-2">
                      <select
  value={item.assignedManagerId}
  onChange={(e) => handleManagerChange(item.id, e.target.value)}
  className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white font-semibold text-slate-800 focus:outline-none"
>
  <option value="">Select Manager</option>

  {managers.map((manager) => (
    <option key={manager.id} value={manager.id}>
      {manager.name}
    </option>
  ))}
</select>
                    </td>

                    <td className="py-4 px-2 text-right">
                      {item.status === "approved" ? (
                        <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
                          Approved & Active
                        </span>
                      ) : item.status === "rejected" ? (
                        <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 font-bold text-xs border border-rose-200">
                          Declined
                        </span>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleApprove(item.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button
                            onClick={() => handleReject(item.id)}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 font-bold text-xs transition-colors"
                          >
                            Decline
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
