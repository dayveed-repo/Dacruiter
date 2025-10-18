"use client";
import React, { useState } from "react";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { convertToSubcurrency } from "@/app/helpers/general";
import toast from "react-hot-toast";
import { config } from "@/app/config/toast";
import StripeCheckout from "./StripeCheckout";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const StripePaymentWrapper = ({
  credits,
  clientSecret,
}: {
  credits: number;
  clientSecret: string;
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
      />
    </Elements>
  );
};

export default StripePaymentWrapper;
