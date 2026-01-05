import React, { useState } from "react";
import { ChevronDown, Sparkles } from "lucide-react";

const faqs = [
    {
        question: "What is Flux Hire AI and how is it different from traditional hiring platforms?",
        answer: "Flux Hire AI uses standardized evaluation frameworks and performance-based scoring to ensure consistent, unbiased assessments across all candidates. Every decision is driven by measurable technical signals, not subjective judgment.",
    },
    {
        question: "How does the AI-powered interview process work?",
        answer: "Our AI agents conduct real-time technical interviews, adapting to the candidate's responses. They evaluate code quality, system design thinking, and problem-solving approaches in a natural, conversational manner.",
    },
    {
        question: "Can the interview process be customized for my organization?",
        answer: "Yes. You can configure the AI agents with your specific tech stack, engineering values, and seniority requirements. We support custom question banks and evaluation rubrics.",
    },
    {
        question: "Do we still need human interviewers?",
        answer: "Flux Hire AI is designed to handle the heavy lifting of technical screening and initial rounds. While many companies use it to replace first and second rounds entirely, human interviewers often conduct the final cultural fit round. The AI provides such detailed reports that human decision-making becomes much faster.",
    },
    {
        question: "Do you offer onboarding or support?",
        answer: "Absolutely. We provide dedicated onboarding support to integrate Flux Hire AI with your existing ATS and workflows. Our enterprise plans include a dedicated customer success manager.",
    },
];

const FAQItem = ({ faq, index, isOpen, toggle }) => {
    return (
        <div className="mb-4">
            <button
                onClick={toggle}
                className="w-full flex items-start justify-between gap-4 text-left group bg-white hover:bg-slate-50 transition-colors p-4 rounded-lg"
            >
                <div className="flex gap-4">
                    {/* Orange Sidebar Line */}
                    <div className="w-1 bg-[#ED5E29] self-stretch rounded-full flex-shrink-0"></div>
                    <span className="text-base md:text-lg font-semibold text-slate-900 group-hover:text-[#ED5E29] transition-colors pt-1">
                        {faq.question}
                    </span>
                </div>
                <ChevronDown
                    className={`h-5 w-5 text-slate-400 flex-shrink-0 transition-transform duration-300 mt-1.5 ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
            >
                <div className="pl-9 pr-6 pb-6 pt-2 text-slate-600 leading-relaxed max-w-2xl ml-4">
                    {faq.answer}
                </div>
            </div>

            {/* Divider line except for last item */}
            <div className="h-px bg-slate-100 mt-2 mx-4"></div>
        </div>
    );
};

export const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <section id="faq" className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
                    {/* Left Column: Header */}
                    <div className="lg:col-span-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider mb-6">
                            <img src="/sparkles-custom.png" className="h-3 w-3" alt="sparkles" />
                            FAQ
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight tracking-tight">
                            Frequently asked questions
                        </h2>
                        <p className="text-lg text-slate-500 leading-relaxed font-medium">
                            Get answers to common questions about Flux Hire AI's interview process, AI agents, security, pricing, and integrations.
                        </p>
                    </div>

                    {/* Right Column: Accordion */}
                    <div className="lg:col-span-8">
                        {faqs.map((faq, index) => (
                            <FAQItem
                                key={index}
                                faq={faq}
                                index={index}
                                isOpen={openIndex === index}
                                toggle={() => setOpenIndex(index === openIndex ? -1 : index)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQ;
