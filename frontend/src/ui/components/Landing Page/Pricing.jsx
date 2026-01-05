import React from "react";
import { Link } from "react-router-dom";

import { Check, ArrowRight } from "lucide-react";
import Button from "@/ui/components/Button";

const pricingPlans = [
    {
        name: "Starter",
        price: "49",
        description: "Perfect for small teams getting started",
        features: [
            "Up to 50 interviews/month",
            "MCQ + DSA assessments",
            "Basic analytics dashboard",
            "Email support",
            "30-day data retention",
        ],
        cta: "Start Free Trial",
        popular: false,
    },
    {
        name: "Professional",
        price: "149",
        description: "For growing companies hiring at scale",
        features: [
            "Up to 200 interviews/month",
            "MCQ + DSA + AI video interviews",
            "Advanced analytics & insights",
            "Priority support",
            "90-day data retention",
            "Custom branding",
            "API access",
        ],
        cta: "Start Free Trial",
        popular: true,
    },
    {
        name: "Enterprise",
        price: "Custom",
        description: "For large organizations with custom needs",
        features: [
            "Unlimited interviews",
            "All assessment types",
            "Dedicated success manager",
            "24/7 premium support",
            "Unlimited data retention",
            "Custom integrations",
            "SLA guarantees",
        ],
        cta: "Contact Sales",
        popular: false,
    },
];

export const Pricing = () => {
    return (
        <section id="pricing" className="py-16 bg-slate-50">
            <div className="container mx-auto px-6">
                <div className="opacity-0 translate-y-4 transition-all duration-600 text-center mb-12 max-w-3xl mx-auto" data-animate>






                    <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="text-lg text-slate-600">
                        Choose the plan that fits your hiring needs. All plans include a 14-day free trial.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {pricingPlans.map((plan, index) => (
                        <div key={plan.name} className={`relative rounded-xl p-6 ${plan.popular ? "bg-white text-slate-900 shadow-lg scale-[1.02] border-2" : "bg-white border-2 border-slate-200"} opacity-0 translate-y-4 transition-all duration-600`} style={plan.popular ? { borderColor: '#ed5e29' } : {}} data-animate>

                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold shadow-md text-white" style={{ backgroundColor: '#ed5e29' }}>
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className="text-xl font-bold mb-1 text-slate-900">
                                    {plan.name}
                                </h3>
                                <p className="text-sm text-slate-600">
                                    {plan.description}
                                </p>
                            </div>

                            <div className="mb-6">
                                <div className="flex items-baseline gap-1">
                                    {plan.price === "Custom" ? (
                                        <span className="text-3xl font-bold text-slate-900">
                                            {plan.price}
                                        </span>
                                    ) : (
                                        <>
                                            <span className="text-4xl font-bold text-slate-900">
                                                ${plan.price}
                                            </span>
                                            <span className="text-sm text-slate-600">
                                                /month
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <Link to="/signup" className="block w-full mb-6">
                                <Button
                                    variant="primary"
                                    size="lg"
                                    className="w-full"
                                    icon={<ArrowRight className="h-4 w-4" />}
                                    iconPosition="right"
                                >
                                    {plan.cta}
                                </Button>
                            </Link>

                            <ul className="space-y-3">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-2.5">
                                        <Check className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: '#ed5e29' }} />
                                        <span className="text-sm text-slate-700">
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-8 text-center opacity-0 transition-opacity duration-600" data-animate>

                    <p className="text-sm text-slate-500">
                        All plans include 14-day free trial. No credit card required.
                    </p>
                </div>
            </div>
        </section >
    );
};

export default Pricing;
