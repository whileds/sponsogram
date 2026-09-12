"use client";

import React, { useEffect, useRef } from "react";
import { OutlineButton, PrimaryButton } from "./CipUI";


export default function Hero() {
  const heroRef = useRef<HTMLElement | null>(null);

useEffect(() => {
  const hero = heroRef.current;

  if (!hero) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        hero.classList.remove("hero-animate");
        
        // Force browser to restart the animation
        void hero.offsetWidth;

        hero.classList.add("hero-animate");
      }
    },
    {
      threshold: 0.3,
    }
  );

  observer.observe(hero);

  return () => observer.disconnect();
}, []);
  return (
    <section
      ref={heroRef}
      className="relative -mt-0 min-h-[720px] overflow-hidden"
      style={{
        backgroundImage: "url('/hero-creator.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Soft overlay — keeps the image visible */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Subtle CIP purple atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-950/20 via-transparent to-fuchsia-900/10" />

      {/* Hero content */}
      <div className="relative z-10 flex min-h-[720px] w-full items-center justify-center px-6 text-center">
        <div className="mx-auto w-full max-w-4xl">

          {/* Small label */}
          {/* <div className="mb-7 inline-flex items-center rounded-full border border-white/25 bg-white/10 px-5 py-2 text-sm font-medium text-white/90 backdrop-blur-md">
            Creator Incubation Program
          </div> */}

          {/* Main heading */}
          <h1 className="font-[var(--font-jakarta)] text-6xl font-extrabold leading-[0.92] tracking-[-0.045em] sm:text-7xl lg:text-[92px]">

            <span className="hero-word hero-left block text-white">
              Create.
            </span>

            <span className="hero-word hero-right block text-violet-300">
              Grow.
            </span>

            <span className="hero-word hero-bottom block bg-gradient-to-r from-fuchsia-300 via-pink-300 to-violet-300 bg-clip-text text-transparent">
              Monetize.
            </span>

            <span className="hero-word hero-top block text-white/95">
              With CIP.
            </span>

          </h1>

          {/* Description */}
          <p className="mx-auto mt-8 max-w-2xl text-base leading-7 font-medium text-white/80 sm:text-lg sm:leading-8">
            Join our Creator Incubation Program and get everything you need
            to grow your audience, create better content, collaborate with
            brands, and build a thriving creator business.
          </p>

          {/* CTA buttons */}
          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <PrimaryButton>
              Apply for Incubation →
            </PrimaryButton>

            <PrimaryButton>
              Explore Program
            </PrimaryButton>
          </div>

          {/* Creator social proof */}
          <div className="mt-9 flex items-center justify-center gap-3">

            <div className="flex">
  {[
    { letter: "A", color: "bg-violet-500" },
    { letter: "R", color: "bg-blue-500" },
    { letter: "S", color: "bg-pink-500" },
    { letter: "K", color: "bg-fuchsia-500" },
  ].map((item, i) => (
    <span
      key={item.letter}
      style={{
        marginLeft: i === 0 ? 0 : -10,
      }}
      className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-white ${item.color} text-xs font-bold text-white shadow-lg`}
    >
      {item.letter}
    </span>
  ))}
</div>

            <p className="text-sm font-extrabold text-fuchsia-200">
              500+ creators are already growing with CIP
            </p>

          </div>

        </div>
      </div>
    </section>
  
  );
  
}