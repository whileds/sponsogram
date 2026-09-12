"use client";

import React, { useEffect, useRef } from "react";
import { STEPS } from "./cipData";
import { gradientBg } from "./CipUI";

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.remove("how-works-animate");

          // Restart animation
          void section.offsetWidth;

          section.classList.add("how-works-animate");
        } else {
          section.classList.remove("how-works-animate");
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
      id="how-it-works"
      className="bg-[#F7F5FB] px-8 py-20"
    >
      {/* Heading */}
      <div className="mx-auto mb-16 max-w-xl text-center">
        <h2 className="text-[34px] font-extrabold tracking-tight">
          How It Works
        </h2>
      </div>

      {/* Timeline */}
      <div className="relative mx-auto h-[270px] max-w-5xl">

        {/* Backbone */}
        <div className="how-backbone">
          <div className="how-glow" />
        </div>

        {/* Steps */}
        <div className="relative z-10 grid h-full grid-cols-5">
          {STEPS.map((s, index) => (
            <div
              key={s.num}
              className={`how-step how-step-${index} relative flex flex-col items-center`}
            >
              {/* Connection from backbone to circle */}
              <div className="how-branch" />

              {/* Circle */}
              <div
                className={`how-circle flex h-14 w-14 items-center justify-center rounded-full text-lg font-extrabold text-white shadow-[0_8px_25px_rgba(123,47,247,0.25)] ${gradientBg}`}
              >
                {s.num}
              </div>

              {/* Text */}
              <div className="how-content text-center">
                <h4 className="mb-1.5 text-[14.5px] font-bold">
                  {s.title}
                </h4>

                <p className="mx-auto max-w-[140px] text-xs leading-5 text-[#6B6478]">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}