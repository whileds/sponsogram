"use client";

import React, { useEffect, useRef, useState } from "react";
import { FAQS } from "./cipData";

export default function Faq() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.remove("faq-animate");

          // Restart animation
          void section.offsetWidth;

          section.classList.add("faq-animate");
        } else {
          section.classList.remove("faq-animate");
        }
      },
      {
        threshold: 0.2,
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="px-8 py-20"
    >
      {/* Heading */}
      <div className="mx-auto mb-11 max-w-xl text-center">
        <h2 className="text-[34px] font-extrabold tracking-tight">
          Frequently Asked Questions
        </h2>
      </div>

      {/* FAQ */}
      <div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 md:grid-cols-2">
        {FAQS.map((faq, i) => (
          <div
            key={faq.q}
            className={`faq-card faq-card-${i} rounded-xl border border-[#EAE6F2] bg-white p-4`}
          >
            <button
              onClick={() =>
                setOpenFaq(openFaq === i ? null : i)
              }
              className="flex w-full items-center justify-between text-left text-sm font-semibold"
            >
              <span>{faq.q}</span>

              <span className="ml-3 shrink-0 text-lg font-normal text-[#7B2FF7]">
                {openFaq === i ? "−" : "+"}
              </span>
            </button>

            {openFaq === i && (
              <p className="mt-3 text-[13px] leading-relaxed text-[#6B6478]">
                {faq.a}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}