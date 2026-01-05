import React from "react";

const testimonials = [
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
];

export const Testimonial = () => {
  return (
    <section id="testimonials" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20 max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">The Flux Hire AI Experience</h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            At Flux Hire AI, we pride ourselves on delivering top-notch AI-driven hiring solutions. But don't just take our word for it. Hear what our satisfied users have to say.
          </p>
        </div>

        {/* Card Layout matching the design */}
        <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch">
          {testimonials.map((card, idx) => (
            <div key={idx} className="flex-1 min-w-[300px] max-w-[400px] bg-white rounded-[24px] border border-slate-200 p-10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center">
              <p className="text-slate-600 leading-loose mb-8 flex-grow text-[15px] font-medium">
                {card.text}
              </p>
              <div className="mt-auto flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-[#FFEF5C] flex items-center justify-center text-2xl mb-4 border-2 border-white shadow-sm">
                  {card.avatar}
                </div>
                <h4 className="text-base font-bold text-slate-900">{card.name}</h4>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wide mt-1">{card.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;