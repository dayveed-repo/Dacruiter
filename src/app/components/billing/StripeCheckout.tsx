"use client";
import { config } from "@/app/config/toast";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import React, { useState } from "react";
import toast from "react-hot-toast";

const StripeCheckout = ({
  clientSecret,
  amount,
}: {
  clientSecret: string;
  amount: number;
  credits: number;
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    if (!stripe || !elements) {
      return;
    }

    const { error: submitError } = await elements.submit();

    if (submitError) {
      setErrorMessage(
        submitError?.message || "An error occurred while processing payment"
      );
      setLoading(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      clientSecret,
      redirect: "if_required",
      confirmParams: {
        return_url: `https://www.${window.location.hostname}`,
      },
    });

    if (error) {
      // This point is only reached if there's an immediate error when
      // confirming the payment. Show the error to your customer (for example, payment details incomplete)
      setErrorMessage(error.message || "Failed to process payment");
      toast.error("Failed to process payment", config);
    } else {
      // The payment UI automatically closes with a success animation.
      // Your customer is redirected to your `return_url`.

      toast.success("Your payment was processed successfully", config);
      console.log("PaymentIntent:", paymentIntent);
    }

    setLoading(false);
  };
  return (
    <>
      {!clientSecret || !stripe || !elements ? (
        <div className="flex items-center justify-center min-h-40">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {clientSecret && <PaymentElement />}

          {errorMessage && (
            <div className="text-[#FE2C37] text-sm mt-2">{errorMessage}</div>
          )}

          <button
            className="base-button w-full mt-5 rounded"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : `Pay $${amount.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}`}
          </button>
        </form>
      )}
    </>
  );
};

export default StripeCheckout;
