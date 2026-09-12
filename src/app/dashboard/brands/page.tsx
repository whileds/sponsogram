"use client";

import React, { useEffect, useState } from "react";
import { Briefcase, DollarSign, CheckCircle2, ShieldCheck, Sparkles, Building, ArrowRight, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface BrandDeal {
  id: string;
  brandName: string;
  logo: string;
  niche: string;
  payout: string;
  deliverables: string;
  deadline: string;
  applied: boolean;
  applicationStatus?: "APPLIED" | "SHORTLISTED" | "ACCEPTED" | "REJECTED";
}

export default function BrandsPage() {
  const { user } = useAuth();
  
  // const [deals, setDeals] = useState<BrandDeal[]>([]);
  const [deals, setDeals] = useState<BrandDeal[]>([]);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const loadDeals = async () => {
    try {
      const response = await fetch("/api/brands");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load brand deals");
      }

      setDeals(data.deals);
    } catch (error) {
      console.error("Failed to load brands:", error);
    } finally {
      setIsLoading(false);
    }
  };

  loadDeals();
}, []);

  const handleApply = async (id: string) => {
  try {
    const response = await fetch("/api/brands/apply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        campaignId: id,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to apply");
    }

    setDeals((currentDeals) =>
  currentDeals.map((deal) =>
    deal.id === id
      ? {
          ...deal,
          applied: true,
          applicationStatus: "APPLIED",
        }
      : deal
  )
);
  } catch (error) {
    console.error("Failed to apply:", error);
    alert(error instanceof Error ? error.message : "Something went wrong");
  }
};  

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold text-xs border border-emerald-500/30 mb-2">
            <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
            <span>Guaranteed Brand Matching Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Brand Collaborations & Sponsorship Board
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
            Sponsogram pitches your channel to top brands. Personal Manager handles contracts & payment processing.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-right min-w-[200px]">
          <div className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Monthly Pitch Limit</div>
          <div className="text-2xl font-black text-emerald-300">
            {user?.package === "CREATOR LITE" ? "4 Brands / Mo" : "UNLIMITED"}
          </div>
          <div className="text-[11px] text-slate-300 font-medium">Included in {user?.package || "CREATOR PLUS"}</div>
        </div>
      </div>

      {/* Brand Deals Grid */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="font-extrabold text-slate-900 text-base">
            Verified Brand Deal Opportunities ({deals.length} Active Deals)
          </h3>
          <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> 100% Payment Escrow Protection
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {deals.map((deal) => (
            <div
              key={deal.id}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={deal.logo}
                      alt={deal.brandName}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-xs"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{deal.brandName}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                        {deal.niche}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-extrabold text-emerald-600">{deal.payout}</div>
                    <div className="text-[10px] text-slate-400 font-semibold">Fixed Payout</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs space-y-1">
                  <div className="font-bold text-slate-700">Deliverables:</div>
                  <div className="text-slate-600 font-medium">{deal.deliverables}</div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">Deadline: {deal.deadline}</span>
                {deal.applied ? (
                  <span className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1">
                    <Check className="w-4 h-4 text-emerald-700" /> Application Pitched
                  </span>
                ) : (
                  <button
                    onClick={() => handleApply(deal.id)}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
                  >
                    <span>Pitch My Profile</span>
                    <ArrowRight className="w-4 h-4" />
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
