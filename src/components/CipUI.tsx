"use client";
import React from "react";
import Link from "next/link";

export const gradientText = "bg-gradient-to-r from-[#293075] to-[#4f85b5] bg-clip-text text-transparent";
export const gradientBg = "bg-gradient-to-r from-[#293075] to-[#4f85b5]";

export function PrimaryButton({
  children,
  className = "",
  href = "/apply",
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-white ${gradientBg} transition hover:brightness-110 ${className}`}
    >
      {children}
    </Link>
  );
}

export function OutlineButton({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <button className={`inline-flex items-center gap-2 rounded-lg border border-[#EAE6F2] bg-white px-5 py-3 text-sm font-semibold text-[#14121A] transition hover:border-[#7B2FF7] hover:text-[#7B2FF7] ${className}`}>{children}</button>;
}

export function FloatCard({ label, value, sub, valueClass = "", className = "" }: { label: string; value: string; sub?: string; valueClass?: string; className?: string }) {
  return <div className={`absolute rounded-xl bg-white px-4 py-3 shadow-[0_12px_30px_rgba(30,10,60,0.14)] ${className}`}>
    <div className="text-[11px] text-[#6B6478]">{label}</div>
    <div className={`text-base font-extrabold ${valueClass}`}>{value}</div>
    {sub && <div className="mt-0.5 text-[10.5px] font-semibold text-emerald-600">{sub}</div>}
  </div>;
}

export function FooterColumn({ title, items }: { title: string; items: string[] }) {
  return <div><h5 className="mb-4 text-[13.5px] text-white">{title}</h5><ul className="space-y-2.5 text-[13px]">
    {items.map(item => <li key={item}><a href="#" className="hover:text-white">{item}</a></li>)}
  </ul></div>;
}
