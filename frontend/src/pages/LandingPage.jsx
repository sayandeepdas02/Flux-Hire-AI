import React from "react";
import Navbar from "../ui/components/Landing Page/Navbar";
import CTA from "../ui/components/Landing Page/CTA";
import Features from "../ui/components/Landing Page/Features";
import Testimonial from "../ui/components/Landing Page/Testimonial";
import Pricing from "../ui/components/Landing Page/Pricing";
import FAQ from "../ui/components/Landing Page/FAQ";
import Footer from "../ui/components/Landing Page/Footer";

export default function LandingPage() {
  React.useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove("opacity-0", "translate-y-4");
          entry.target.classList.add("opacity-100", "translate-y-0");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll("[data-animate]");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white font-inter selection:bg-orange-100 selection:text-orange-900">
      <Navbar />
      <CTA />
      <Features />
      <Testimonial />
      <Pricing />
      <FAQ />
      <Footer />
    </div>
  );
}
