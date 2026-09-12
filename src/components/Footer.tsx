"use client";
import React from "react";
import { FooterColumn, gradientBg } from "./CipUI";

export default function Footer() {
  return <footer className="bg-[#0F0D14] px-8 pb-8 pt-14 text-[#B9B4C6]"><div className="mx-auto mb-10 grid max-w-6xl grid-cols-2 gap-8 md:grid-cols-5">
    <div className="col-span-2 md:col-span-1"><div className="flex items-center gap-2.5"><div className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-extrabold text-white ${gradientBg}`}>S</div><div><b className="block text-[15px] text-white">SPONSOGRAM</b><span className="block text-[11px] text-[#8B8698]">Creator Incubation Program</span></div></div>
      <p className="mt-3 max-w-[220px] text-[13px] leading-relaxed">Empowering creators with the right tools, support and opportunities to grow, monetize and scale their impact.</p>
      <div className="mt-4 flex gap-3.5">{["𝕏","◎","▶","in"].map(icon=><a key={icon} href="#" className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1D1A24] text-sm">{icon}</a>)}</div>
    </div>
    <FooterColumn title="Platform" items={["Overview","Toolkit","For Brands","For Agencies"]}/><FooterColumn title="Company" items={["About Us","Careers","Blog","Contact Us"]}/><FooterColumn title="Legal" items={["Terms of Service","Privacy Policy","Refund Policy"]}/><FooterColumn title="Resources" items={["Help Center","Guidelines","Community"]}/>
  </div><div className="mx-auto max-w-6xl border-t border-[#211D29] pt-5 text-center text-xs">© 2026 Sponsogram. All rights reserved.</div></footer>;
}
