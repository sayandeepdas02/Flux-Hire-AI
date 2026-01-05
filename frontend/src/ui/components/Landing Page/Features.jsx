import React from "react";
import { Zap, Code, BarChart3, Clock, Shield, Users, CheckCircle, ArrowRight, Play, Sparkles, LayoutList, GitBranch, Video, FileCheck, TerminalSquare, Settings, Globe } from "lucide-react";
import Button from "@/ui/components/Button";

// Logos
const LogoStrip = () => (
  <section className="py-10 border-b border-slate-100 bg-white">
    <div className="container mx-auto px-6">
      <p className="text-center text-sm font-medium text-slate-400 mb-6 uppercase tracking-wider">Trusted by high-growth engineering teams</p>
      <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
        {["Intercom", "Dropbox", "Stripe", "Linear", "Discord", "Shopify"].map(brand => (
          <span key={brand} className="text-xl font-bold text-slate-500 flex items-center gap-2">
            <div className="h-6 w-6 bg-slate-400 rounded-full opacity-50"></div>
            {brand}
          </span>
        ))}
      </div>
    </div>
  </section>
);

// Section 3: Value Prop (Broken vs Fixed)
const ValuePropSection = () => (
  <section className="py-20 md:py-28 bg-white overflow-hidden">
    <div className="container mx-auto px-6">
      <div className="flex flex-col items-center text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-[#ED5E29] text-xs font-bold uppercase tracking-wider mb-4">
          <Zap className="h-3 w-3" />
          problem & solution
        </div>
        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
          Hiring Great Engineers is Broken.
          <br />
          <span className="text-[#ED5E29]">We Fixed It.</span>
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl">
          Traditional hiring processes are slow, biased, and expensive. Flux Hire AI streamlines everything into a single, intelligent platform.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Visual / Graph */}
        <div className="relative order-2 lg:order-1 animate-fade-in-left">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-white">
            <div className="absolute inset-0 bg-gradient-to-br from-[#ED5E29] to-orange-600 opacity-90"></div>
            {/* Abstract Graph Pattern */}
            <div className="relative h-[400px] w-full p-8 flex items-center justify-center">
              <div className="w-full h-full border-l border-b border-white/30 relative">
                {/* Fake Chart Line */}
                <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
                  <path d="M0 300 C 100 280, 200 150, 400 100" stroke="white" strokeWidth="3" fill="none" strokeDasharray="5,5" className="opacity-50" />
                  <path d="M0 300 C 100 250, 200 100, 400 50" stroke="white" strokeWidth="4" fill="none" />
                </svg>
                {/* Floating Badge */}
                <div className="absolute top-10 right-10 bg-white rounded-lg p-3 shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-xs font-bold text-slate-900">95% Faster</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Decorative Elements */}
          <div className="absolute -z-10 -bottom-10 -left-10 w-40 h-40 bg-orange-100 rounded-full blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="order-1 lg:order-2 space-y-8 animate-fade-in-right">
          {[
            { title: "Automated Screening", desc: "No more resume operational overhead. AI screens thousands of candidates instantly." },
            { title: "Fair Evaluation", desc: "Bias-free technical assessments focusing purely on coding skills and problem solving." },
            { title: "Instant Feedback", desc: "Candidates receive real-time feedback, keeping them engaged and improving their experience." },
            { title: "Data-Driven Decisions", desc: "Detailed analytics helping you hire the best fit for your team culture and tech stack." }
          ].map((item, idx) => (
            <div key={idx} className="flex gap-4">
              <div className="mt-1 flex-shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
                  <CheckCircle className="h-5 w-5 text-[#ED5E29]" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
          <div className="pt-4">
            <Button className="bg-[#ED5E29] hover:bg-[#ED5E29]/90 text-white font-semibold px-8 py-3 rounded-xl shadow-lg shadow-orange-500/20">
              See how it works
            </Button>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// NEW: Interview Process Frame (Inserted as requested)
const InterviewProcessSection = () => (
  <section className="py-20 bg-white border-t border-slate-100">
    <div className="container mx-auto px-6">
      <div className="text-center max-w-4xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-200 bg-white shadow-sm text-slate-700 text-xs font-semibold uppercase tracking-wider mb-6">
          <img src="/sparkles-custom.png" className="h-3 w-3" alt="sparkles" />
          Interview Process
        </div>
        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight tracking-tight">
          Hiring Great Engineers Is Broken. <br />
          We Fixed It.
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
          Flux Hire AI replaces fragmented interviews with a fully automated, AI-driven evaluation system that rigorously tests real engineering skills.
        </p>
        <div className="flex justify-center gap-4">
          <Button className="bg-[#ED5E29] hover:bg-[#ED5E29]/90 text-white font-bold rounded-lg px-6 py-2.5">
            Get a demo
          </Button>
          <Button variant="outline" className="border-slate-200 text-slate-700 font-bold rounded-lg px-6 py-2.5">
            Research
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
        {/* Left Column: Rounds List */}
        <div className="space-y-6 relative">
          {/* Timeline Line */}
          <div className="absolute left-[26px] top-10 bottom-10 w-[2px] bg-slate-100 z-0"></div>

          {/* Round 1 */}
          <div className="relative z-10 bg-white rounded-xl border-2 border-[#ffdab9] p-6 shadow-sm">
            <div className="flex gap-4">
              <div className="mt-1 flex-shrink-0 w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center border border-orange-100">
                <LayoutList className="h-5 w-5 text-[#ED5E29]" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                  Round 1 — Core CS Screening (MCQs)
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  30 deeply technical multiple-choice questions designed to test fundamental computer science knowledge. Coverage includes: DSA, OS, DBMS, Computer Networks & Core CS fundamentals.
                </p>
              </div>
            </div>
          </div>

          {/* Round 2 */}
          <div className="relative z-10 bg-white rounded-xl border border-slate-200 p-6 hover:border-slate-300 transition-colors">
            <div className="flex gap-4">
              <div className="mt-1 flex-shrink-0 w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                <GitBranch className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Round 2 — Live DSA Coding Assessment</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Real-time algorithmic problem solving in a fully configured IDE environment. Assesses problem-solving approach, coding efficiency, and performance under time constraints.
                </p>
              </div>
            </div>
          </div>

          {/* Round 3 */}
          <div className="relative z-10 bg-white rounded-xl border border-slate-200 p-6 hover:border-slate-300 transition-colors">
            <div className="flex gap-4">
              <div className="mt-1 flex-shrink-0 w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                <Video className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Round 3 — 1:1 interview with AI Native Engineering Lead</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Deep technical interviews powered by conversational AI agents trained to evaluate system design, architecture, and advanced engineering concepts through adaptive questioning.
                </p>
              </div>
            </div>
          </div>

          {/* Round 4 */}
          <div className="relative z-10 bg-white rounded-xl border border-slate-200 p-6 hover:border-slate-300 transition-colors">
            <div className="flex gap-4">
              <div className="mt-1 flex-shrink-0 w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                <FileCheck className="h-5 w-5 text-slate-600" />
              </div>
              <div className="w-full">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-900">Round 4 — Final Round with your team</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-slate-200 text-slate-400">Optional</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  In the fast-paced world of business, every second counts. Neuros processes data in real-time, ensuring you're always working with the most up-to-date information.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Visual */}
        <div className="relative h-full min-h-[500px] rounded-3xl bg-gradient-to-br from-[#ED5E29] to-[#d64b1a] overflow-hidden shadow-2xl p-8 flex items-center justify-center">
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.3) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

          {/* Wavy Graph Lines */}
          <svg className="absolute bottom-0 left-0 right-0 w-full h-full opacity-40 pointer-events-none" viewBox="0 0 400 300" preserveAspectRatio="none">
            <path d="M0 250 C 100 240, 150 150, 200 180 S 300 100, 400 120" stroke="white" strokeWidth="4" fill="none" />
            <path d="M0 280 C 80 270, 120 200, 200 220 S 320 180, 400 190" stroke="white" strokeWidth="2" fill="none" strokeDasharray="5,5" />
          </svg>

          {/* Floating Badge */}
          <div className="relative z-10 glass-effect bg-white/90 backdrop-blur-md rounded-full px-5 py-3 shadow-xl flex items-center gap-3 animate-fade-in-up">
            <img src="/sparkles-custom.png" className="h-5 w-5" alt="sparkles" />
            <span className="font-bold text-slate-900 text-lg">AI-Driven Forecasts</span>
          </div>

          {/* Glass Overlay Gradient */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/10 to-transparent"></div>
        </div>
      </div>
    </div>
  </section>
);

// Features Grid
const details = [
  {
    icon: BarChart3,
    title: "Predictive Scoring",
    desc: "AI-powered scoring that ranks candidates based on real performance across MCQs, live coding, and technical assessments.",
    highlight: "High-volume hiring, fast-growing teams"
  },
  {
    icon: Code,
    title: "Live Coding Environment",
    desc: "A production-grade coding IDE for real-time DSA interviews. Evaluate how candidates think, code, and optimize — in real-time.",
    highlight: "Python • Java • C++ • Javascript"
  },
  {
    icon: Users,
    title: "AI Interview Agents",
    desc: "Conversational AI agents trained on your exact role requirements to conduct deep technical interviews on system design and architecture.",
    highlight: "Scalable, unbiased technical interviews"
  },
  {
    icon: TerminalSquare,
    title: "Custom Question Banks",
    desc: "Create and manage role-specific MCQs, DSA problems, and system design prompts — tailored to your tech stack and seniority levels.",
    highlight: "Backend, frontend, full-stack, infra roles"
  },
  {
    icon: FileCheck,
    title: "Detailed Interview Reports",
    desc: "Get structured, signal-rich reports covering strengths, weaknesses, coding quality, design thinking, and final hire recommendations.",
    highlight: "Faster decisions with high confidence"
  },
  {
    icon: Users,
    title: "Seamless Collaboration",
    desc: "Share candidate evaluations, AI insights, and interview reports instantly with hiring managers — no meetings, no back-and-forth.",
    highlight: "Engineering leads & recruiters"
  },
];

const FeaturesGrid = () => (
  <section className="py-24 bg-white">
    <div className="container mx-auto px-6">
      <div className="text-center max-w-3xl mx-auto mb-20">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-200 bg-white shadow-sm text-slate-700 text-xs font-semibold uppercase tracking-wider mb-6">
          <img src="/sparkles-custom.png" className="h-3 w-3" alt="sparkles" />
          features
        </div>
        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
          Everything You Need to Hire Elite Engineers
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed">
          Flux Hire AI gives you a complete, AI-native hiring stack — from screening to system design — built to identify real engineering talent, not resume keywords.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {details.map((feature, idx) => (
          <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-200 hover:shadow-xl hover:border-slate-300 transition-all duration-300 group flex flex-col h-full items-start text-left">
            <div className="mb-6 text-slate-700 group-hover:text-[#ED5E29] transition-colors">
              <feature.icon className="h-8 w-8 stroke-[1.5]" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">{feature.title}</h3>
            <p className="text-slate-600 leading-relaxed mb-6 flex-grow">
              {feature.desc}
            </p>
            <p className="text-sm font-medium text-[#ED5E29] mt-auto">
              {feature.highlight}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Orange Banner CTA
const OrangeBanner = () => (
  <section className="py-20 md:py-28">
    <div className="container mx-auto px-6">
      <div className="relative rounded-[32px] overflow-hidden bg-[#ED5E29] px-8 py-12 md:px-16 md:py-20 shadow-2xl shadow-orange-500/30">
        {/* Abstract Background Patterns */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 800 400" preserveAspectRatio="none">
            <path d="M0 300 C 200 250, 400 350, 800 200" stroke="white" strokeWidth="2" fill="none" opacity="0.3" />
            <path d="M0 350 C 300 300, 500 400, 800 250" stroke="white" strokeWidth="2" fill="none" opacity="0.2" />
          </svg>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        </div>

        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-left">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight leading-[1.1]">
              Experience the Future of Engineering Hiring with Flux Hire AI
            </h2>
            <Button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold px-8 py-4 text-lg rounded-xl transition-all border border-white/40 shadow-lg group">
              Start your free trial
              <Sparkles className="h-5 w-5 ml-2 group-hover:rotate-12 transition-transform" />
            </Button>
          </div>

          {/* Right Features List */}
          <div className="space-y-4">
            {[
              {
                title: "AI-Driven Precision",
                desc: "Every decision is backed by structured evaluation, not intuition.",
                icon: BarChart3
              },
              {
                title: "Customizable for Your Org",
                desc: "Train AI agents on your tech stack, architecture, and expectations.",
                icon: Settings
              },
              {
                title: "Real-World Engineering Focus",
                desc: "We test how engineers think, design, and solve — not how they memorize.",
                icon: Globe
              }
            ].map((item, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 flex gap-5 items-start hover:bg-white/15 transition-colors">
                <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                  <item.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-orange-100 text-sm leading-relaxed opacity-90">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Experience Section (Testimonials)
const ExperienceSection = () => (
  <section className="py-24 bg-white overflow-hidden">
    <div className="container mx-auto px-6">
      <div className="text-center mb-20 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">The Flux Hire AI Experience</h2>
        <p className="text-slate-500 text-lg">
          At Neuros, we pride ourselves on delivering top-notch AI-driven business analytics. But don't just take our word for it. Hear what our satisfied users have to say.
        </p>
      </div>

      {/* Horizontal Scroll / Grid Layout */}
      {/* Note: Using a flex layout with negative margins to simulate the 'cut-off' look on edges if desired, or a simple grid */}
      <div className="flex flex-col md:flex-row gap-6 md:overflow-x-auto pb-10 md:pb-4 justify-center">
        {[
          {
            text: "Flux Hire AI reduced our hiring cycle from weeks to just a few days. The AI interviews run continuously, and our team only speaks to top-quality engineers. We're moving faster without compromising standards.",
            name: "Nathan D. Hall",
            role: "Project Lead",
            avatar: "👨‍💻"
          },
          {
            text: "By replacing multiple manual interview rounds with Flux Hire AI, we significantly cut interviewer hours and operational costs. The ROI was immediate — fewer interviews, better hires, and zero wasted time.",
            name: "Naomi K. Johnson",
            role: "Product Manager",
            avatar: "👩‍💼"
          },
          {
            text: "Every candidate who reaches the final round is genuinely strong. Flux Hire AI filters out noise and surfaces engineers with real problem-solving and system design skills. Our hiring bar is higher, with far less effort.",
            name: "Michael O. Lopez",
            role: "Operations Director",
            avatar: "🧑‍🚀"
          }
        ].map((card, idx) => (
          <div key={idx} className="min-w-[300px] md:min-w-[380px] md:max-w-[400px] bg-white rounded-3xl border border-slate-200 p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center">
            <p className="text-slate-600 leading-loose mb-8 flex-grow text-[15px]">
              {card.text}
            </p>
            <div className="mt-auto flex flex-col items-center">
              <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center text-xl mb-3 border border-yellow-200">
                {card.avatar}
              </div>
              <h4 className="text-sm font-bold text-slate-900">{card.name}</h4>
              <p className="text-xs text-slate-500 uppercase tracking-wide mt-1">{card.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const Features = () => {
  return (
    <>
      <LogoStrip />
      <ValuePropSection />
      <InterviewProcessSection />
      <section id="features">
        <FeaturesGrid />
      </section>
      <OrangeBanner />
    </>
  );
};

export default Features;