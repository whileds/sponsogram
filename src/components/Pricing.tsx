"use client";

import React, { useEffect, useRef, useState } from "react";
import { MONTHLY_PLANS, QUARTERLY_PLANS } from "./cipData";
import { OutlineButton, PrimaryButton, gradientBg } from "./CipUI";

export default function Pricing() {
  const [billing, setBilling] = useState<"monthly" | "quarterly">("monthly");
  const sectionRef = useRef<HTMLElement | null>(null);

  const plans =
    billing === "monthly" ? MONTHLY_PLANS : QUARTERLY_PLANS;

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.remove("pricing-animate");

          // Restart animation every time section enters viewport
          void section.offsetWidth;

          section.classList.add("pricing-animate");
        } else {
          section.classList.remove("pricing-animate");
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
      id="pricing"
      className="px-8 py-20"
    >
      {/* Heading */}
      <div className="mx-auto mb-11 max-w-xl text-center">
        <h2 className="text-[34px] font-extrabold tracking-tight">
          Choose Your Plan
        </h2>
      </div>

      {/* Billing Toggle */}
      <div className="mb-11 flex justify-center">
        <div className="flex gap-1 rounded-full bg-[#F7F5FB] p-1.5">
          <button
            onClick={() => setBilling("monthly")}
            className={`rounded-full px-5 py-2 text-[13.5px] font-semibold transition ${
              billing === "monthly"
                ? `text-white ${gradientBg}`
                : "text-[#6B6478]"
            }`}
          >
            Monthly
          </button>

          <button
            onClick={() => setBilling("quarterly")}
            className={`rounded-full px-5 py-2 text-[13.5px] font-semibold transition ${
              billing === "quarterly"
                ? `text-white ${gradientBg}`
                : "text-[#6B6478]"
            }`}
          >
            Quarterly

            <span className="ml-1.5 rounded-md bg-emerald-600 px-1.5 py-0.5 text-[10.5px] text-white">
              Save 15%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
        {plans.map((plan, index) => (
          <div
            key={plan.name}
            className={`pricing-card pricing-card-${index} relative rounded-[18px] border bg-white p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(123,47,247,0.14)] ${
              plan.featured
                ? "border-[#7B2FF7] shadow-[0_20px_44px_rgba(123,47,247,0.18)] md:-translate-y-2"
                : "border-[#EAE6F2]"
            }`}
          >
            {/* Popular Badge */}
            {plan.featured && (
              <div
                className={`absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1.5 text-[11px] font-bold text-white ${gradientBg}`}
              >
                Most Popular
              </div>
            )}

            <h3 className="mb-2.5 text-base font-bold">
              {plan.name}
            </h3>

            <div className="text-3xl font-extrabold">
              {plan.price}
              <span className="text-sm font-medium text-[#6B6478]">
                /{billing === "monthly" ? "month" : "quarter"}
              </span>
            </div>

            <ul className="my-6 space-y-3">
              {plan.features.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2 text-[13.5px]"
                >
                  <span className="font-extrabold text-[#7B2FF7]">
                    ✓
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            {plan.featured ? (
              <PrimaryButton className="w-full justify-center">
                Get Started
              </PrimaryButton>
            ) : (
              <OutlineButton className="w-full justify-center">
                Get Started
              </OutlineButton>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}