"use client";

import React from "react";
import { PrimaryButton } from "./CipUI";

const NAV_LINKS = [
  { name: "Platform", href: "#services" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "Pricing", href: "#pricing" },
  { name: "Stories", href: "#spotlight" },
  { name: "FAQ", href: "#faq" },
];

export default function Navbar() {
  return (
    <>
      <header className="sticky top-0 z-50 flex items-center justify-between border border-white/60 border-b-[#EAE6F2] bg-violet-200/50 px-8 py-4 shadow-[0_8px_32px_rgba(109,40,217,0.08)] backdrop-blur-xl">

        {/* LOGO */}
        <div className="flex items-center gap-2.5 animate-logo">
          <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg">
            <img
              src="/logo.jpg"
              alt="Sponsogram"
              className="h-full w-full object-contain"
            />
          </div>

          <div>
            <b className="block text-[15px] tracking-wide">
              CIP
            </b>

            <span className="block text-[11px] text-[#6B6478]">
              Creator Incubation Program
            </span>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="hidden gap-8 md:flex animate-nav">
          {NAV_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium transition-colors hover:text-[#7B2FF7]"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* LOGIN + APPLY */}
        <div className="hidden items-center gap-5 md:flex animate-slide-in-right">
          <PrimaryButton
            href="/login"
            className="text-sm font-semibold"
          >
            Login
          </PrimaryButton>

          <PrimaryButton>
            Apply for Incubation →
          </PrimaryButton>
        </div>

      </header>

      <style jsx>{`
        /* Logo comes slightly from the left */
        @keyframes logo-enter {
          from {
            opacity: 0;
            transform: translateX(-35px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Navigation comes slightly from the top */
        @keyframes nav-enter {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Login + Apply come from the right */
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(80px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-logo {
          animation: logo-enter 0.7s ease-out forwards;
        }

        .animate-nav {
          animation: nav-enter 0.7s ease-out 0.15s forwards;
          opacity: 0;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.7s ease-out 0.3s forwards;
          opacity: 0;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-logo,
          .animate-nav,
          .animate-slide-in-right {
            animation: none;
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </>
  );
}