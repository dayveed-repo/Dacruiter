"use client";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { convertToSubcurrency } from "@/app/helpers/general";
import StripeCheckout from "./StripeCheckout";
import { Dispatch, SetStateAction } from "react";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const StripePaymentWrapper = ({
  credits,
  clientSecret,
  onClose,
  setrefreshHistory,
}: {
  credits: number;
  clientSecret: string;
  onClose?: () => void;
  setrefreshHistory: Dispatch<SetStateAction<number>>;
}) => {
  const amount = credits * 1.5;

  return (
    <Elements
      stripe={stripePromise}
      options={{
        mode: "payment",
        amount: convertToSubcurrency(amount),
        currency: "usd",
        appearance: {
          theme: "flat",
        },
      }}
    >
      <StripeCheckout
        clientSecret={clientSecret}
        amount={amount}
        credits={credits}
        onClose={onClose}
        setrefreshHistory={setrefreshHistory}
      />
    </Elements>
  );
};

export default StripePaymentWrapper;
