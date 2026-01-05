import React from "react";
import Button from "@/ui/components/Button";
import { Link } from "react-router-dom";
import { Sparkles, Play } from "lucide-react";

export const CTA = () => {
  return (
    <section className="flex flex-col items-center bg-white px-6 py-16 md:px-8 md:py-20 lg:px-8 lg:py-28 overflow-hidden">
      <div className="flex w-full max-w-[1204px] flex-col items-center gap-10 md:gap-12 lg:gap-15">

        {/* Hero Content */}
        <div className="flex w-full max-w-[860px] flex-col items-center gap-8 md:gap-10 animate-fade-in-up">
          <div className="flex w-full flex-col items-center gap-5">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm hover:shadow-md transition-shadow">
              <img src="/sparkles-custom.png" className="h-4 w-4" alt="sparkles" />
              <span>AI-Native Hiring Platform</span>
            </div>

            {/* Headline */}
            <h1 className="w-full text-center text-4xl font-bold leading-tight tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
              Hire Top 1% Engineers
              <br />
              <span className="text-[#ED5E29]">with Flux Hire AI</span>
            </h1>

            {/* Subheading */}
            <div className="w-full px-4 md:px-12 lg:px-20">
              <p className="text-center text-lg leading-relaxed text-slate-600 md:text-xl">
                Harnesses the power of our AI Native Platform to hire engineers
                100x faster, improving 10x efficiency, cutting 50x costs and
                improving productivity.
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <Link to="/signup">
              <Button
                className="h-auto rounded-xl bg-[#ED5E29] px-8 py-4 text-base font-bold text-white transition-all hover:bg-[#ED5E29]/90 hover:shadow-lg hover:-translate-y-0.5"
              >
                Start your free trial
              </Button>
            </Link>
            <Button
              variant="outline"
              className="group h-auto gap-2 rounded-xl border-slate-200 bg-white px-8 py-4 text-base font-bold text-slate-600 transition-all hover:border-[#ED5E29] hover:text-[#ED5E29]"
            >
              <Play className="h-5 w-5 fill-current text-slate-600 group-hover:text-[#ED5E29]" />
              Watch video
            </Button>
          </div>
        </div>

        {/* Hero Visual / Video Placeholder */}
        <div className="relative w-full max-w-5xl mt-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {/* Decorative Elements */}
          <div className="absolute -top-12 -left-12 h-64 w-64 rounded-full bg-orange-100 blur-3xl opacity-50"></div>
          <div className="absolute -bottom-12 -right-12 h-64 w-64 rounded-full bg-blue-100 blur-3xl opacity-50"></div>

          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            {/* Abstract Dashboard/Video Mockup */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#ED5E29] to-orange-600 flex items-center justify-center group cursor-pointer overflow-hidden">
              {/* Grid Pattern overlay */}
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

              {/* Circles */}
              <div className="absolute top-0 right-0 h-96 w-96 translate-x-1/2 -translate-y-1/2 rounded-full border-[2px] border-white/10"></div>
              <div className="absolute top-0 right-0 h-[500px] w-[500px] translate-x-1/2 -translate-y-1/2 rounded-full border-[2px] border-white/10"></div>
              <div className="absolute bottom-0 left-0 h-96 w-96 -translate-x-1/2 translate-y-1/2 rounded-full border-[2px] border-white/10"></div>

              {/* Play Button */}
              <div className="relative z-10 h-20 w-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center transition-transform duration-300 group-hover:scale-110 border border-white/30 shadow-xl">
                <div className="h-14 w-14 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <Play className="h-6 w-6 fill-[#ED5E29] text-[#ED5E29] ml-1" />
                </div>
              </div>

              <div className="absolute bottom-8 left-0 right-0 text-center text-white font-medium text-lg/none tracking-wide opacity-90">
                See how it works (1:45)
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default CTA;