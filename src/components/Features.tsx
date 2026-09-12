"use client";

import React, { useEffect, useRef } from "react";
import { FEATURES } from "./cipData";
import { gradientText } from "./CipUI";

export default function Features() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.remove("features-animate");

          // Restart animation
          void section.offsetWidth;

          section.classList.add("features-animate");
        } else {
          section.classList.remove("features-animate");
        }
      },
      {
        threshold: 0.25,
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="px-8 py-20"
    >
      {/* Heading */}
      <div className="mx-auto mb-11 max-w-xl text-center">
        <h2 className="text-[34px] font-extrabold tracking-tight">
          Everything{" "}
          <span className={gradientText}>You Get</span>{" "}
          With CIP
        </h2>
      </div>

      {/* Features */}
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
        {FEATURES.map((f, index) => (
          <div
            key={f.title}
            className={`feature-card feature-card-${index} group rounded-2xl border border-[#EAE6F2] bg-white p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[#7B2FF7] hover:shadow-[0_10px_24px_rgba(123,47,247,0.10)]`}
          >
            {/* Feature Image */}
            <div className="mb-4 h-24 w-full overflow-hidden rounded-xl">
              <img
                src={f.image}
                alt={f.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Feature Content */}
            <h4 className="mb-1.5 text-[13.5px] font-bold leading-tight text-slate-900">
              {f.title}
            </h4>

            <p className="text-[11.5px] leading-relaxed text-[#6B6478]">
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}