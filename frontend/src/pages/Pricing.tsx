import { motion } from "framer-motion";
import {
  Check,
  Loader2,
  Sparkles,
  ShieldCheck,
  Crown,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  createSubscriptionOrder,
  verifySubscriptionPayment,
} from "@/api/subscriptionApi";
import { loadRazorpayScript } from "@/api/loadRazorpay";
import { toast } from "react-toastify";
import { useAuth } from "@/contexts/AuthContext";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const Pricing = () => {
  const [yearly, setYearly] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const plans = [
    {
      name: "Free",
      key: "free",
      monthly: 0,
      yearly: 0,
      icon: ShieldCheck,
      badge: "Start here",
      description: "Best for exploring the platform and learning the basics.",
      features: [
        "Access to free courses",
        "Community access",
        "Basic learning experience",
        "Wishlist and reviews",
      ],
      cta: "Start Free",
      popular: false,
      accent:
        "from-slate-200 via-white to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900",
    },
    {
      name: "Pro",
      key: "pro",
      monthly: 199,
      yearly: 1990,
      icon: Zap,
      badge: "Most Popular",
      description: "Best for serious learners who want complete course access.",
      features: [
        "Access to all courses",
        "Certificates for completed courses",
        "Unlimited AI quiz generation",
        "Unlimited AI learning assistant",
        "Priority support",
      ],
      cta: "Choose Pro",
      popular: true,
      accent:
        "from-primary/15 via-background to-accent/10",
    },
    {
      name: "Premium",
      key: "premium",
      monthly: 499,
      yearly: 4990,
      icon: Crown,
      badge: "Advanced",
      description: "Best for high-intent learners who want premium support and extras.",
      features: [
        "Everything in Pro",
        "Exclusive premium content",
        "Mentorship access",
        "Premium support",
        "Early access to selected features",
      ],
      cta: "Go Premium",
      popular: false,
      accent:
        "from-amber-100 via-white to-orange-100 dark:from-amber-950/40 dark:via-slate-950 dark:to-orange-950/30",
    },
  ];

  const handleChoosePlan = async (planKey: "free" | "pro" | "premium") => {
    if (!isAuthenticated) {
      toast.info("Please login first");
      navigate("/login");
      return;
    }

    const billingCycle = yearly ? "yearly" : "monthly";
    const loadingKey = `${planKey}-${billingCycle}`;

    try {
      setLoadingPlan(loadingKey);

      if (planKey === "free") {
        const data = await createSubscriptionOrder({
          plan: "free",
          billingCycle,
        });

        if (data?.success) {
          toast.success("Free plan activated");
          navigate("/courses");
          return;
        }

        toast.error(data?.message || "Failed to activate free plan");
        return;
      }

      const loaded = await loadRazorpayScript();

      if (!loaded || !window.Razorpay) {
        toast.error("Razorpay SDK failed to load");
        return;
      }

      const data = await createSubscriptionOrder({
        plan: planKey,
        billingCycle,
      });

      if (!data?.success || !data?.order?.id) {
        toast.error(data?.message || "Failed to create subscription order");
        return;
      }

      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Coursify",
        description: `${planKey.toUpperCase()} Plan - ${
          billingCycle === "yearly" ? "Yearly" : "Monthly"
        }`,
        order_id: data.order.id,
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: {
          color: "#0f172a",
        },
        handler: async function (response: any) {
          try {
            const verifyData = await verifySubscriptionPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyData.success) {
              toast.success("Plan activated successfully");
              navigate("/courses");
            } else {
              toast.error(verifyData.message || "Payment verification failed");
            }
          } catch (err: any) {
            toast.error(
              err?.response?.data?.message || "Payment verification failed"
            );
          } finally {
            setLoadingPlan(null);
          }
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response: any) {
        toast.error(
          response?.error?.description || "Payment failed. Please try again."
        );
        setLoadingPlan(null);
      });

      razorpay.open();
    } catch (err: any) {
      console.error("SUBSCRIPTION ERROR:", err?.response?.data || err);
      toast.error(
        err?.response?.data?.message || "Failed to process subscription"
      );
      setLoadingPlan(null);
    }
  };

  return (
    <div className="relative overflow-hidden bg-background py-20 sm:py-24">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.10),transparent_30%),radial-gradient(circle_at_top_right,hsl(var(--accent)/0.08),transparent_28%),radial-gradient(circle_at_bottom,hsl(var(--primary)/0.08),transparent_30%)]" />

      <section className="container">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-3xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur">
            <Sparkles className="h-4 w-4 text-primary" />
            Flexible pricing for every type of learner
          </div>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Choose the plan that matches your{" "}
            <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              learning pace
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Start free, upgrade when you want full access, and scale to premium
            when you need deeper support, exclusive content, and stronger learning tools.
          </p>

          <div className="mt-8 flex justify-center">
            <div className="inline-flex items-center rounded-full border bg-card p-1 shadow-sm">
              <button
                onClick={() => setYearly(false)}
                className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                  !yearly
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Monthly
              </button>

              <button
                onClick={() => setYearly(true)}
                className={`relative rounded-full px-5 py-2.5 text-sm font-medium transition ${
                  yearly
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Yearly
                <span className="ml-2 rounded-full bg-green-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </motion.div>

        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {plans.map((plan, i) => {
            const price = yearly ? plan.yearly : plan.monthly;
            const billingCycle = yearly ? "yearly" : "monthly";
            const loadingKey = `${plan.key}-${billingCycle}`;
            const Icon = plan.icon;

            return (
              <motion.div
                key={plan.name}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1/2">
                    <span className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground shadow-lg">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <Card
                  className={`group relative h-full overflow-hidden rounded-[28px] border bg-card/90 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                    plan.popular
                      ? "border-primary/50 ring-1 ring-primary/20"
                      : "border-border"
                  }`}
                >
                  <div
                    className={`absolute inset-x-0 top-0 h-32 bg-gradient-to-br ${plan.accent} opacity-90`}
                  />

                  <CardContent className="relative flex h-full flex-col px-6 pb-6 pt-8">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-3">
                        {!plan.popular && (
                          <span className="inline-flex rounded-full border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
                            {plan.badge}
                          </span>
                        )}

                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border bg-background/90 shadow-sm">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>

                        <div>
                          <h2 className="text-2xl font-bold tracking-tight">
                            {plan.name}
                          </h2>
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            {plan.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8">
                      <div className="flex items-end justify-center gap-1">
                        <span className="text-lg font-medium text-muted-foreground">
                          ₹
                        </span>
                        <span className="text-5xl font-extrabold tracking-tight">
                          {price}
                        </span>
                      </div>

                      <p className="mt-2 text-center text-sm text-muted-foreground">
                        {plan.key === "free"
                          ? "Forever free"
                          : yearly
                          ? "per year"
                          : "per month"}
                      </p>
                    </div>

                    <div className="mt-8 flex-1">
                      <div className="rounded-2xl border bg-background/60 p-4">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Included in this plan
                        </p>

                        <ul className="space-y-3">
                          {plan.features.map((feature) => (
                            <li
                              key={feature}
                              className="flex items-start gap-3 text-sm"
                            >
                              <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                <Check className="h-3.5 w-3.5 text-primary" />
                              </span>
                              <span className="text-foreground/90">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-8">
                      <Button
                        className={`w-full rounded-xl py-6 text-sm font-semibold transition ${
                          plan.popular
                            ? "shadow-lg shadow-primary/20"
                            : ""
                        }`}
                        variant={plan.popular ? "default" : "outline"}
                        onClick={() =>
                          handleChoosePlan(plan.key as "free" | "pro" | "premium")
                        }
                        disabled={loadingPlan === loadingKey}
                      >
                        {loadingPlan === loadingKey ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          plan.cta
                        )}
                      </Button>

                      <p className="mt-3 text-center text-xs text-muted-foreground">
                        {plan.key === "free"
                          ? "Start instantly with no payment required"
                          : "Secure checkout with Razorpay"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mx-auto mt-16 max-w-4xl rounded-[28px] border bg-card/80 p-6 shadow-sm backdrop-blur sm:p-8"
        >
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border bg-background/70 p-5">
              <p className="text-sm font-semibold">Free</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Best for trying the platform and exploring the learning experience.
              </p>
            </div>

            <div className="rounded-2xl border bg-background/70 p-5">
              <p className="text-sm font-semibold">Pro</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Best for serious learners who want complete course access and certificates.
              </p>
            </div>

            <div className="rounded-2xl border bg-background/70 p-5">
              <p className="text-sm font-semibold">Premium</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Best for advanced learners who want mentorship and premium support.
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Pricing;