"use client";

import { useMemo, useState } from "react";
import { createCourseOrder, verifyCoursePayment } from "@/api/paymentApi";
import { loadRazorpayScript } from "@/api/loadRazorpay";

type RazorpayCheckoutButtonProps = {
  courseId: string;
  courseTitle: string;
  price: number;
  affiliateCode?: string;
  studentName?: string;
  studentEmail?: string;
  studentPhone?: string;
  onSuccess?: () => void;
  onError?: (message: string) => void;
  className?: string;
  buttonText?: string;
};

export default function RazorpayCheckoutButton({
  courseId,
  courseTitle,
  price,
  affiliateCode = "",
  studentName = "",
  studentEmail = "",
  studentPhone = "",
  onSuccess,
  onError,
  className = "",
  buttonText = "Buy Now",
}: RazorpayCheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<"idle" | "error" | "success">(
    "idle"
  );

  const formattedPrice = useMemo(() => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price || 0);
  }, [price]);

  const showError = (message: string) => {
    setStatusType("error");
    setStatusMessage(message);
    onError?.(message);
  };

  const showSuccess = (message: string) => {
    setStatusType("success");
    setStatusMessage(message);
  };

  const handlePayment = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setStatusType("idle");
    setStatusMessage("");

    try {
      const isLoaded = await loadRazorpayScript();

      if (!isLoaded || !window.Razorpay) {
        throw new Error("Razorpay SDK failed to load. Please refresh and try again.");
      }

      const orderData = await createCourseOrder(courseId, affiliateCode);

      console.log("CREATE ORDER RESPONSE:", orderData);

      if (!orderData?.success) {
        throw new Error(orderData?.message || "Failed to create payment order.");
      }

      if (!orderData?.order?.id) {
        throw new Error("Invalid order response from server.");
      }

      const razorpay = new window.Razorpay({
        key: orderData.key,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        order_id: orderData.order.id,
        name: "Coursify",
        description: orderData.course?.title || courseTitle || "Course Purchase",
        prefill: {
          name: studentName,
          email: studentEmail,
          contact: studentPhone,
        },
        notes: {
          courseId,
        },
        theme: {
          color: "#111827",
        },
        modal: {
          confirm_close: true,
          escape: true,
          animation: true,
          ondismiss: () => {
            setIsLoading(false);
            showError("Payment popup was closed before completing the payment.");
          },
        },
        handler: async (response) => {
          try {
            const verifyData = await verifyCoursePayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            console.log("VERIFY PAYMENT RESPONSE:", verifyData);

            if (!verifyData?.success) {
              throw new Error(
                verifyData?.message || "Payment verification failed."
              );
            }

            showSuccess("Payment successful. You are now enrolled.");
            setIsLoading(false);
            onSuccess?.();
          } catch (verifyError: any) {
            console.error("VERIFY PAYMENT FRONTEND ERROR:", verifyError);

            const message =
              verifyError?.response?.data?.message ||
              verifyError?.message ||
              "Payment completed but verification failed. Contact support.";

            showError(message);
            setIsLoading(false);
          }
        },
      });

      razorpay.on("payment.failed", (response) => {
        console.error("RAZORPAY PAYMENT FAILED:", response);

        const message =
          response?.error?.description ||
          response?.error?.reason ||
          "Payment failed. Please try again.";

        showError(message);
        setIsLoading(false);
      });

      razorpay.open();
    } catch (error: any) {
      console.error("PAYMENT FRONTEND ERROR:", error);
      console.error("PAYMENT FRONTEND ERROR RESPONSE:", error?.response?.data);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to start payment. Please try again.";

      showError(message);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handlePayment}
        disabled={isLoading}
        className={`inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 ${
          isLoading
            ? "cursor-not-allowed bg-gray-400"
            : "bg-gray-900 hover:bg-black active:scale-[0.99]"
        } ${className}`}
      >
        {isLoading ? "Processing..." : `${buttonText} • ${formattedPrice}`}
      </button>

      {statusMessage ? (
        <div
          className={`mt-3 rounded-lg border px-3 py-2 text-sm ${
            statusType === "error"
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-green-200 bg-green-50 text-green-700"
          }`}
        >
          {statusMessage}
        </div>
      ) : null}
    </div>
  );
}