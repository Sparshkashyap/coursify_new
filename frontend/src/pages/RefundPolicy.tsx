import React from "react";

const RefundPolicy: React.FC = () => {
  return (
    <div className="container max-w-4xl py-16">
      <h1 className="text-3xl font-bold mb-6">Refund Policy</h1>

      <div className="space-y-4 text-muted-foreground leading-7">
        <p>
          At Coursify, we strive to provide high-quality learning content.
          Please read our refund policy carefully before making a purchase.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          1. Course Purchases
        </h2>
        <p>
          All course purchases are generally non-refundable once the course has
          been accessed or consumed.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          2. Duplicate Payments
        </h2>
        <p>
          If a user is charged twice due to a payment error, the extra amount
          will be refunded within 5–7 business days.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          3. Technical Issues
        </h2>
        <p>
          If a course is not accessible due to a technical issue on our platform
          and the issue is not resolved within a reasonable time, users may
          request a refund.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          4. Refund Requests
        </h2>
        <p>
          To request a refund, please contact us at{" "}
          <strong>supportCoursify@gmail.com</strong> with your payment details.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          5. Processing Time
        </h2>
        <p>
          Approved refunds will be processed within 5–7 business days to the
          original payment method.
        </p>

        <p className="mt-6">
          By purchasing a course on Coursify, you agree to this refund policy.
        </p>
      </div>
    </div>
  );
};

export default RefundPolicy;