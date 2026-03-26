export {};

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }

  interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }

  interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description?: string;
    image?: string;
    order_id: string;
    prefill?: {
      name?: string;
      email?: string;
      contact?: string;
    };
    notes?: Record<string, string>;
    theme?: {
      color?: string;
    };
    modal?: {
      ondismiss?: () => void;
      confirm_close?: boolean;
      escape?: boolean;
      animation?: boolean;
    };
    handler: (response: RazorpayResponse) => void | Promise<void>;
  }

  interface RazorpayInstance {
    open: () => void;
    on: (
      event: "payment.failed",
      callback: (response: {
        error: {
          code?: string;
          description?: string;
          source?: string;
          step?: string;
          reason?: string;
          metadata?: {
            order_id?: string;
            payment_id?: string;
          };
        };
      }) => void
    ) => void;
  }
}