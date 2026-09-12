"use client";

import React, { useEffect, useRef } from "react";
import { PrimaryButton } from "./CipUI";

export default function Cta() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.remove("cta-animate");

          // Restart animation
          void section.offsetWidth;

          section.classList.add("cta-animate");
        } else {
          section.classList.remove("cta-animate");
        }
      },
      {
        threshold: 0.3,
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const heading =
    "Ready to take your creator journey to the next level?";

  const description =
    "Join Sponsogram's Creator Incubation Program and turn your passion into a powerful brand.";

  return (
    <section
      ref={sectionRef}
      className="px-8 pb-20"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-7 rounded-3xl bg-gradient-to-br from-[#F1E6FF] to-[#FCE7F3] p-10 text-center md:flex-row md:justify-between md:text-left">

        {/* Left Content */}
        <div className="flex flex-col items-center gap-5 md:flex-row">

          {/* Rocket */}
          <div className="cta-rocket text-5xl">
            🚀
          </div>

          <div>
            {/* Heading - WORD BY WORD */}
            <h3 className="cta-heading mb-2 text-2xl font-extrabold">
              {heading.split(" ").map((word, index) => (
                <span
                  key={index}
                  className="cta-heading-word"
                  style={{
                    animationDelay: `${index * 0.07}s`,
                  }}
                >
                  {word}&nbsp;
                </span>
              ))}
            </h3>

            {/* Description - CHARACTER BY CHARACTER */}
            <p className="cta-description max-w-md text-sm text-[#6B6478]">
              {description.split("").map((char, index) => (
                <span
                  key={index}
                  className="cta-description-char"
                  style={{
                    animationDelay: `${0.9 + index * 0.018}s`,
                  }}
                >
                   {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </p>
          </div>
        </div>

        {/* Button */}
        <div className="cta-button shrink-0">
          <PrimaryButton>
            Apply for Incubation →
          </PrimaryButton>
        </div>

      </div>
    </section>
  );
}