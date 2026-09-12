"use client";

import React, { useEffect, useRef, useState } from "react";
import { STATS, TESTIMONIALS } from "./cipData";
import { gradientBg } from "./CipUI";

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [statsStarted, setStatsStarted] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsStarted(false);

          // Restart animation
          void section.offsetWidth;

          setTimeout(() => {
            setStatsStarted(true);
          }, 100);
        } else {
          setStatsStarted(false);
        }
      },
      {
        threshold: 0.3,
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="spotlight"
      className="px-8 py-20"
    >
      {/* Heading */}
      <div className="mx-auto mb-11 max-w-xl text-center">
        <h2 className="text-[34px] font-extrabold tracking-tight">
          Creators. Stories. Impact.
        </h2>
      </div>

      {/* Testimonials */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 md:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <div
            key={t.name}
            className="flex gap-3.5 rounded-2xl border border-[#EAE6F2] p-6"
          >
            <div
              className={`flex h-13 w-13 shrink-0 items-center justify-center rounded-full text-base font-bold text-white ${gradientBg}`}
            >
              {t.initial}
            </div>

            <div>
              <p className="mb-2.5 text-[13.5px] leading-relaxed">
                &quot;{t.quote}&quot;
              </p>

              <div className="flex items-center gap-1 text-[13px] font-bold">
                {t.name}
                <span className="text-[#4C9EF5]">✔</span>
              </div>

              <div className="text-[11.5px] text-[#6B6478]">
                {t.subs}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div
        className={`mx-auto mt-14 grid max-w-6xl grid-cols-2 gap-5 rounded-[20px] px-6 py-8 text-center text-white md:grid-cols-4 ${gradientBg}`}
      >
        {STATS.map((s, index) => (
          <StatItem
            key={s.label}
            stat={s}
            started={statsStarted}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}


/* =========================================
   STAT ITEM
========================================= */

function StatItem({
  stat,
  started,
  index,
}: {
  stat: {
    value: string;
    label: string;
  };
  started: boolean;
  index: number;
}) {
  const match = stat.value.match(/^([\d.]+)(.*)$/);

  const number = match ? Number(match[1]) : 0;
  const suffix = match ? match[2] : "";

  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) {
      setCount(0);
      return;
    }

    const duration = 1200;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const progress = Math.min(
        (currentTime - startTime) / duration,
        1
      );

      // Makes the counting feel slightly snappy
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setCount(Math.floor(number * easedProgress));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(number);
      }
    };

    requestAnimationFrame(animate);
  }, [started, number]);

  return (
    <div
      className={`stat-item stat-item-${index} ${
        started ? "stats-animate" : ""
      }`}
    >
      <b className="block text-2xl font-extrabold">
        {count}
        <span className="stat-suffix">{suffix}</span>
      </b>

      <span className="text-xs opacity-90">
        {stat.label}
      </span>
    </div>
  );
}