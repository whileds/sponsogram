export const NAV_LINKS = ["Platform", "How It Works", "Pricing", "Stories", "FAQ"];

export const CIP_PILLARS = [
    {
    title: "Content Strategy",
    desc: "Build a clear content strategy with data-backed insights & tools.",
    image: "/cip-content.jpg",
  },
  {
    title: "Audience Growth",
    desc: "Grow your audience with expert strategies.",
    image: "/cip-growth.jpg",
  },
  {
    title: "Brand Collaborations",
    desc: "Connect with relevant brands and monetize your content.",
    image: "/cip-brands.jpg",
  },
  {
    title: "Creator Support",
    desc: "Get guidance and mentorship from top creators and experts.",
    image: "/cip-support.jpg",
  },
  // { icon: "✏️", title: "Create", desc: "Better content with data-backed insights & tools." },
  // { icon: "📈", title: "Grow", desc: "Your audience faster with expert strategy." },
  // { icon: "💲", title: "Monetize", desc: "With brand deals and multiple income opportunities." },
  // { icon: "🚀", title: "Scale", desc: "Your brand and build a lasting creator business." },
];

export const FEATURES = [
   {
    title: "Content Ideation & Strategy",
    desc: "Trend analysis, niche insights and viral content ideas.",
    image: "/content-strategy.jpg",
  },
  {
    title: "Video Editing Support",
    desc: "Professional editing support to make your content stand out.",
    image: "/video-editing.jpg",
  },
  {
    title: "Personal Manager",
    desc: "Dedicated manager to guide you in your creator journey.",
    image: "/personal-manager.jpg",
  },
  {
    title: "Toolkit Access",
    desc: "AI tools, templates, resources and credits system.",
    image: "/toolkit.png",
  },
  {
    title: "Brand Collaborations",
    desc: "Access to verified brand deals and exclusive campaigns.",
    image: "/brand-collaboration.jpeg",
  },
  {
    title: "Free Mentorship",
    desc: "1-on-1 strategy sessions with top industry mentors.",
    image: "/mentorship.jpg",
  },
  {
    title: "Creator Matchmaking",
    desc: "Collaborate with other creators and grow together.",
    image: "/matchmaking.jpg",
  },
];

export const STEPS = [
  { num: 1, title: "Apply", desc: "Fill out the simple application form." },
  { num: 2, title: "Get Reviewed", desc: "Our team reviews your profile." },
  { num: 3, title: "Get Onboarded", desc: "Choose your plan and get access." },
  { num: 4, title: "Use CIP Services", desc: "Access tools, support and opportunities." },
  { num: 5, title: "Grow & Monetize", desc: "Scale your audience and income." },
];

export type Plan = { name: string; price: string; features: string[]; featured?: boolean };

export const MONTHLY_PLANS: Plan[] = [
  { name: "Creator Lite", price: "₹2,999", features: ["100 Toolkit Credits / month", "1 Edited Video / week", "4 Brand Applications / month", "Bi-weekly Mentorship", "Matchmaking Access"] },
  { name: "Creator Plus", price: "₹6,999", featured: true, features: ["Unlimited Toolkit Credits", "2 Edited Videos / week", "8 Brand Applications / month", "Weekly Mentorship", "Priority Matchmaking"] },
  { name: "Creator Premium", price: "₹12,999", features: ["Unlimited Everything", "Unlimited Brand Applications", "1-on-1 Strategy Calls", "Premium Matchmaking", "Early Access to New Features"] },
];

export const QUARTERLY_PLANS: Plan[] = MONTHLY_PLANS.map(p => ({
  ...p,
  price: `₹${(Number(p.price.replace(/[₹,]/g, "")) * 3 * 0.85).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`,
}));

export const TESTIMONIALS = [
  { initial: "A", quote: "CIP changed my creator journey completely. From editing to brand deals, everything is handled so professionally!", name: "Tech With Ayan", subs: "3M+ Subscribers" },
  { initial: "P", quote: "The strategy calls and mentorship helped me scale my channel 3x in just 6 months!", name: "Foodie Planet", subs: "1.8M+ Subscribers" },
  { initial: "G", quote: "With brand collaborations and the CIP toolkit, my revenues have never been better!", name: "Gadget Guru", subs: "2.2M+ Subscribers" },
];

export const STATS = [
  { value: "500+", label: "Creators Incubated" },
  { value: "50M+", label: "Total Reach" },
  { value: "100+", label: "Brands Partnered" },
  { value: "95%", label: "Creator Retention" },
];

export const FAQS = [
  { q: "Who can apply for CIP?", a: "Any creator with an active audience on a major platform (Instagram, YouTube, etc.) and a plan to grow can apply — we review each application individually." },
  { q: "How are brand collaborations assigned?", a: "Our team matches creators with brand campaigns based on niche, audience demographics, and past performance." },
  { q: "How does the application process work?", a: "Fill out the short form, our team reviews your profile within a few days, then you choose a plan and get onboarded." },
  { q: "What is the editing turnaround time?", a: "Standard turnaround is 48–72 hours depending on your plan tier and video length." },
  { q: "Can I upgrade or downgrade my plan?", a: "Yes, you can change your plan anytime from your dashboard — changes apply from the next billing cycle." },
  { q: "Is there any long-term commitment?", a: "No, all plans are billed monthly or quarterly with no long-term lock-in required." },
];
