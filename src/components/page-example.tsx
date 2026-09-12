"use client";
import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WhatIsCip from "@/components/WhatIsCip";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import Faq from "@/components/Faq";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";

export default function Page() {
  return <div className="min-h-screen bg-white font-sans text-[#14121A]">
    <Navbar />
    <main><Hero/><WhatIsCip/><Features/><HowItWorks/><Pricing/><Testimonials/><Faq/><Cta/></main>
    <Footer />
  </div>;
}
