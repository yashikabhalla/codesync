"use client";

import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import UpgradeModal from "@/components/dashboard/UpgradeModal";

const plans = [
  {
    name: "Free",
    price: "₹0",
    description: "Perfect for students",
    features: [
      { text: "3 rooms per month", included: true },
      { text: "2 participants per room", included: true },
      { text: "8 programming languages", included: true },
      { text: "Code execution", included: true },
      { text: "Video calling", included: false },
      { text: "AI Interviewer", included: false },
      { text: "Session recordings", included: false },
    ],
    cta: "Get Started Free",
    href: "/sign-up",
    highlighted: false,
    planKey: "free",
  },
  {
    name: "Pro",
    price: "₹299",
    description: "For serious interview prep",
    features: [
      { text: "Unlimited rooms", included: true },
      { text: "5 participants per room", included: true },
      { text: "10+ programming languages", included: true },
      { text: "Code execution", included: true },
      { text: "Video calling", included: true },
      { text: "AI Interviewer", included: true },
      { text: "Session recordings", included: true },
    ],
    cta: "Start Pro",
    href: "/sign-up",
    highlighted: true,
    planKey: "pro",
  },
];

interface Props {
  userPlan?: string;
}

export default function Pricing({ userPlan }: Props) {
  const { isSignedIn } = useAuth();
  const [showUpgrade, setShowUpgrade] = useState(false);

  return (
    <section id="pricing" className="py-24 px-4">
      <UpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Simple{" "}
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              pricing
            </span>
          </h2>
          <p className="text-gray-400 text-lg">
            Start free. Upgrade when you need more.
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => {
            const isCurrentPlan = isSignedIn && userPlan === plan.planKey;
            const isProAndUserIsFree =
              plan.planKey === "pro" && isSignedIn && userPlan === "free";
            const isProAndUserIsPro =
              plan.planKey === "pro" && isSignedIn && userPlan === "pro";
            const isFreeAndUserIsPro =
              plan.planKey === "free" && isSignedIn && userPlan === "pro";

            return (
              <div
                key={plan.name}
                className={`rounded-2xl p-8 border relative ${
                  plan.highlighted
                    ? "bg-violet-600/20 border-violet-500/50"
                    : "bg-white/5 border-white/10"
                } ${isCurrentPlan ? "ring-2 ring-violet-500" : ""}`}
              >
                {/* Badges */}
                {plan.highlighted && !isCurrentPlan && (
                  <span className="bg-violet-600 text-white text-xs px-3 py-1 rounded-full mb-4 inline-block">
                    Most Popular
                  </span>
                )}
                {isCurrentPlan && (
                  <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full mb-4 inline-block">
                    ✓ Your Current Plan
                  </span>
                )}

                <h3 className="text-white font-bold text-2xl mb-1">
                  {plan.name}
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  {plan.description}
                </p>
                <div className="text-4xl font-bold text-white mb-6">
                  {plan.price}
                  <span className="text-lg text-gray-400 font-normal">
                    /month
                  </span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li
                      key={feature.text}
                      className={`flex items-center gap-3 text-sm ${
                        feature.included ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {feature.included ? (
                        <Check className="w-4 h-4 text-violet-400 flex-shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-gray-600 flex-shrink-0" />
                      )}
                      {feature.text}
                    </li>
                  ))}
                </ul>

                {/* CTA Button Logic */}
                {!isSignedIn && (
                  <Link href={plan.href}>
                    <Button
                      className={`w-full ${
                        plan.highlighted
                          ? "bg-violet-600 hover:bg-violet-700 text-white"
                          : "bg-white/10 hover:bg-white/20 text-white"
                      }`}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                )}

                {isProAndUserIsPro && (
                  <Button
                    disabled
                    className="w-full bg-green-600/20 text-green-400 border border-green-500/30 cursor-default"
                  >
                    ✓ Active Plan
                  </Button>
                )}

                {isFreeAndUserIsPro && (
                  <Link href="/dashboard">
                    <Button className="w-full bg-white/10 hover:bg-white/20 text-white">
                      Go to Dashboard
                    </Button>
                  </Link>
                )}

                {isProAndUserIsFree && (
                  <Button
                    onClick={() => setShowUpgrade(true)}
                    className="w-full bg-violet-600 hover:bg-violet-700 text-white"
                  >
                    Upgrade to Pro
                  </Button>
                )}

                {isSignedIn && userPlan === "free" && plan.planKey === "free" && (
                  <Link href="/dashboard">
                    <Button className="w-full bg-white/10 hover:bg-white/20 text-white">
                      ✓ Current Plan — Go to Dashboard
                    </Button>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
