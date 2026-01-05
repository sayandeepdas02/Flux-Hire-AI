import Button from "@/ui/components/Button";
import { ChevronDown, Menu } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 flex w-full justify-center bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 md:px-8 lg:px-[118px]">
      <nav className="flex w-full max-w-[1204px] items-center justify-between py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-[6px]">
          <img
            src="/flux-logo.png"
            alt="Flux Hire AI Logo"
            className="h-[40px] w-[40px]"
          />
          <span className="font-roboto text-2xl font-bold leading-[36px] tracking-tight text-slate-900">
            Flux Hire AI
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-10 lg:flex">
          <div className="flex items-center gap-8">
            {/* Features with dropdown */}
            <a href="#features" className="flex items-center gap-1 text-center font-dmSans text-sm font-medium leading-[122%] text-slate-600 transition-colors hover:text-[#ED5E29]">
              Features
            </a>

            {/* Other menu items */}
            <a
              href="#pricing"
              className="text-center font-dmSans text-sm font-medium leading-[122%] text-slate-600 transition-colors hover:text-[#ED5E29]"
            >
              Pricing
            </a>
            <a
              href="#testimonials"
              className="text-center font-dmSans text-sm font-medium leading-[122%] text-slate-600 transition-colors hover:text-[#ED5E29]"
            >
              Testimonials
            </a>
          </div>
        </div>

        {/* Desktop CTA Buttons */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link to="/signin">
            <Button
              variant="ghost"
              className="h-auto px-4 py-2 font-dmSans text-sm font-bold text-slate-600 hover:text-[#ED5E29]"
            >
              Sign In
            </Button>
          </Link>
          <Link to="/signup">
            <Button className="h-auto rounded-lg bg-[#ED5E29] px-5 py-2.5 font-dmSans text-sm font-bold text-white shadow-sm hover:bg-[#ED5E29]/90 hover:shadow-md transition-all">
              Start Free Trial
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <Menu className="h-6 w-6 text-slate-600" />
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute left-0 right-0 top-full z-50 bg-white shadow-lg border-t border-slate-100 lg:hidden animate-fade-in-up">
          <div className="flex flex-col gap-4 px-6 py-6">
            {/* Mobile Menu Items */}
            <a
              href="#features"
              className="flex items-center gap-1 text-left font-dmSans text-base font-medium text-slate-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#pricing"
              className="font-dmSans text-base font-medium text-slate-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </a>
            <a
              href="#testimonials"
              className="font-dmSans text-base font-medium text-slate-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Testimonials
            </a>

            {/* Mobile CTA Buttons */}
            <div className="mt-4 flex flex-col gap-3">
              <Link to="/signin" onClick={() => setIsMobileMenuOpen(false)}>
                <Button
                  variant="outline"
                  className="h-auto w-full justify-center rounded-lg border-slate-200 text-slate-600"
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="h-auto w-full justify-center rounded-lg bg-[#ED5E29] text-white">
                  Start Free Trial
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}