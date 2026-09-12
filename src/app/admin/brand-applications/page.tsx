"use client";

import React, { useEffect, useState } from "react";
import {
  Briefcase,
  Check,
  X,
  Clock,
  User,
  Building2,
} from "lucide-react";

interface BrandApplication {
  id: string;
  status: "APPLIED" | "SHORTLISTED" | "ACCEPTED" | "REJECTED";
  appliedAt: string;
  creatorProfile: {
    user: {
      name: string;
      email: string;
    };
    socialHandle: string;
    platform: string;
    niche: string;
  };
  campaign: {
    deliverables: string;
    payoutInPaise: number;
    deadline: string;
    brand: {
      name: string;
      logoUrl: string | null;
      niche: string;
    };
  };
}

export default function BrandApplicationsPage() {
  const [applications, setApplications] = useState<BrandApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadApplications = async () => {
    try {
      const response = await fetch("/api/admin/brand-applications");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load applications");
      }

      setApplications(data.applications);
    } catch (error) {
      console.error("Failed to load brand applications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const updateStatus = async (
    applicationId: string,
    status: "SHORTLISTED" | "ACCEPTED" | "REJECTED"
  ) => {
    setUpdatingId(applicationId);

    try {
      const response = await fetch("/api/admin/brand-applications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          applicationId,
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update application");
      }

      setApplications((current) =>
        current.map((application) =>
          application.id === applicationId
            ? { ...application, status }
            : application
        )
      );
    } catch (error) {
      console.error("Failed to update application:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-sm text-slate-500">
        Loading brand applications...
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-emerald-950 text-white shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-extrabold text-xs border border-indigo-500/30 mb-2">
          <Briefcase className="w-3.5 h-3.5" />
          Brand Applications
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold">
          Brand Collaboration Applications
        </h1>

        <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
          Review creator applications and decide whether to shortlist,
          accept, or reject them.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <h2 className="font-extrabold text-slate-900">
            Applications ({applications.length})
          </h2>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">
            No brand applications yet.
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => {
              const creator = application.creatorProfile;
              const campaign = application.campaign;

              return (
                <div
                  key={application.id}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-indigo-600" />

                        <div>
                          <h3 className="font-bold text-slate-900">
                            {creator.user.name}
                          </h3>

                          <p className="text-xs text-slate-500">
                            {creator.user.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-bold">
                          {creator.niche}
                        </span>

                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-medium">
                          {creator.platform}
                        </span>

                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-medium">
                          {creator.socialHandle}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {campaign.brand.logoUrl ? (
                        <img
                          src={campaign.brand.logoUrl}
                          alt={campaign.brand.name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-indigo-600" />
                        </div>
                      )}

                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">
                          {campaign.brand.name}
                        </h3>

                        <p className="text-xs text-slate-500">
                          {campaign.deliverables}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-extrabold text-emerald-600">
                        ₹
                        {(campaign.payoutInPaise / 100).toLocaleString(
                          "en-IN"
                        )}
                      </div>

                      <div className="text-[10px] text-slate-400">
                        Campaign Payout
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />

                      <span className="text-xs text-slate-500">
                        Applied{" "}
                        {new Date(application.appliedAt).toLocaleDateString(
                          "en-IN"
                        )}
                      </span>

                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-extrabold ${
                          application.status === "ACCEPTED"
                            ? "bg-emerald-100 text-emerald-700"
                            : application.status === "REJECTED"
                            ? "bg-red-100 text-red-700"
                            : application.status === "SHORTLISTED"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-indigo-100 text-indigo-700"
                        }`}
                      >
                        {application.status}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        disabled={updatingId === application.id}
                        onClick={() =>
                          updateStatus(application.id, "SHORTLISTED")
                        }
                        className="px-3 py-2 rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 disabled:opacity-50 text-xs font-bold"
                      >
                        Shortlist
                      </button>

                      <button
                        disabled={updatingId === application.id}
                        onClick={() =>
                          updateStatus(application.id, "ACCEPTED")
                        }
                        className="px-3 py-2 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 disabled:opacity-50 text-xs font-bold flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Accept
                      </button>

                      <button
                        disabled={updatingId === application.id}
                        onClick={() =>
                          updateStatus(application.id, "REJECTED")
                        }
                        className="px-3 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50 text-xs font-bold flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}