"use client";

import React, { useEffect, useRef } from "react";
import { CIP_PILLARS } from "./cipData";
import { OutlineButton } from "./CipUI";

export default function WhatIsCip() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.remove("cip-animate");

          // Restart animation
          void section.offsetWidth;

          section.classList.add("cip-animate");
        } else {
          // Reset when leaving viewport
          section.classList.remove("cip-animate");
        }
      },
      {
        threshold: 0.35,
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="flex min-h-screen items-center bg-[#F7F5FB] px-8 py-20"
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 md:grid-cols-[0.85fr_2fr]">

        {/* LEFT CONTENT */}
        <div>

          <h2 className="cip-title mb-3.5 text-3xl font-extrabold">
            <span>What</span>{" "}
            <span>is</span>{" "}
            <span>CIP?</span>
          </h2>

          <p className="cip-description mb-5 text-sm leading-7 text-[#6B6478]">
  {`The Creator Incubation Program (CIP) is a complete growth ecosystem designed to help creators at every stage. From content strategy to brand deals — we've got you covered.`
    .split(" ")
    .map((word, index) => (
      <span
        key={index}
        className="cip-word"
        style={{ animationDelay: `${0.03 * index}s` }}
      >
        {word}&nbsp;
      </span>
    ))}
</p>
          <div className="cip-button">
            <OutlineButton>
              Know More About CIP
            </OutlineButton>
          </div>

        </div>

        {/* CIP PILLARS */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
     {CIP_PILLARS.map((p, index) => (
  <div
    key={p.title}
    className={`cip-card cip-card-${index} group overflow-hidden rounded-[28px] border border-[#EAE6F2] bg-white shadow-sm transition-shadow duration-500 hover:shadow-xl`}
  >
    {/* Image */}
    <div className="h-44 w-full overflow-hidden">
      <img
        src={p.image}
        alt={p.title}
        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
      />
    </div>

    {/* Content */}
    <div className="p-5">
      <h3 className="mb-2 text-lg font-bold text-slate-950">
        {p.title}
      </h3>

      <p className="text-sm leading-6 text-[#6B6478]">
        {p.desc}
      </p>
    </div>
  </div>
))}
        </div>

      </div>
    </section>
  );
}