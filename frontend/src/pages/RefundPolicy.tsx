import React from "react";
import {
  BadgeDollarSign,
  CreditCard,
  ShieldCheck,
  LifeBuoy,
  Clock3,
  CheckCircle2,
} from "lucide-react";

const policyItems = [
  {
    id: "01",
    title: "Course Purchases",
    icon: BadgeDollarSign,
    description:
      "All course purchases are generally non-refundable once the course has been accessed, started, or substantially consumed.",
  },
  {
    id: "02",
    title: "Duplicate Payments",
    icon: CreditCard,
    description:
      "If you are charged more than once for the same transaction due to a payment error, the extra amount will be refunded within 5–7 business days after verification.",
  },
  {
    id: "03",
    title: "Technical Issues",
    icon: ShieldCheck,
    description:
      "If a purchased course is not accessible due to a technical issue on our platform and the issue is not resolved within a reasonable timeframe, you may be eligible to request a refund.",
  },
  {
    id: "04",
    title: "Refund Requests",
    icon: LifeBuoy,
    description:
      "To request a refund, please contact us at supportCoursify@gmail.com with your payment details, transaction reference, and a brief explanation of the issue.",
  },
  {
    id: "05",
    title: "Processing Time",
    icon: Clock3,
    description:
      "Approved refunds are processed within 5–7 business days and are credited back to the original payment method used during checkout.",
  },
];

const RefundPolicy: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.10),transparent_28%),radial-gradient(circle_at_top_right,rgba(236,72,153,0.08),transparent_30%),radial-gradient(circle_at_bottom,rgba(168,85,247,0.08),transparent_34%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,hsl(var(--border)/0.04)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.04)_1px,transparent_1px)] bg-[size:36px_36px] [mask-image:radial-gradient(circle_at_center,black_35%,transparent_80%)]" />

      <div className="container max-w-5xl py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary shadow-sm backdrop-blur sm:text-sm">
            <CheckCircle2 className="h-4 w-4" />
            Refund & Payments Policy
          </div>

          <h1 className="mt-6 text-4xl font-black tracking-tight text-foreground sm:text-5xl">
            Refund Policy
          </h1>

          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            At Coursify, we aim to provide a reliable learning experience and a
            fair refund process. Please review this policy carefully before
            making a purchase on the platform.
          </p>

          <div className="mt-6 inline-flex rounded-full border border-border/70 bg-card/70 px-4 py-2 text-sm text-muted-foreground shadow-sm backdrop-blur">
            Effective for all purchases made on Coursify
          </div>
        </div>

        <div className="mt-10 grid gap-5 sm:mt-12">
          {policyItems.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className="rounded-3xl border border-border/70 bg-card/80 p-5 shadow-sm backdrop-blur sm:p-6"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div className="flex items-center gap-3">
                    <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="inline-flex h-8 min-w-8 items-center justify-center rounded-full border border-border/70 bg-background px-2 text-xs font-bold text-muted-foreground">
                      {item.id}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-xl font-bold tracking-tight text-foreground">
                      {item.title}
                    </h2>
                    <p className="text-sm leading-7 text-muted-foreground sm:text-base">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 rounded-3xl border border-primary/15 bg-primary/5 p-5 shadow-sm sm:p-6">
          <h3 className="text-lg font-bold text-foreground">Important Note</h3>
          <p className="mt-2 text-sm leading-7 text-muted-foreground sm:text-base">
            Refund approval depends on the nature of the issue, payment
            verification, and course usage status. By purchasing a course on
            Coursify, you agree to this refund policy.
          </p>
        </div>

        <div className="mt-6 rounded-3xl border border-border/70 bg-card/70 p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-bold text-foreground">
                Need help with a refund request?
              </h3>
              <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                Contact our support team with your payment details and issue
                summary.
              </p>
            </div>

            <a
              href="mailto:supportCoursify@gmail.com"
              className="inline-flex w-fit items-center rounded-xl border border-border/70 bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted"
            >
              supportCoursify@gmail.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RefundPolicy;