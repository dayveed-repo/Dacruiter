"use client";
import { LuEqualApproximately } from "react-icons/lu";
import React, { Dispatch, SetStateAction, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { config } from "@/app/config/toast";
import useUser from "@/app/hooks/getUser";
import { LuShoppingBag } from "react-icons/lu";
import StripePaymentWrapper from "./StripePaymentWrapper";
import { MdArrowBack } from "react-icons/md";

const PaymentModal = ({
  onClose,
  setrefreshHistory,
}: {
  onClose?: () => void;
  setrefreshHistory: Dispatch<SetStateAction<number>>;
}) => {
  const [numberOfCredits, setnumberOfCredits] = useState(10);
  const [generatingStripeIntent, setgeneratingStripeIntent] = useState(false);
  const [clientSecret, setClientSecret] = useState<any>(null);

  const [user] = useUser();

  const generateStripeIntent = async () => {
    if (!numberOfCredits || numberOfCredits < 10)
      return toast.error("Minimum number of credits to purchase is 10", config);

    setgeneratingStripeIntent(true);
    try {
      await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          numberOfCredits,
          userEmail: user?.email,
          supabaseUserId: user.supabaseUserId,
        }),
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret));
    } catch (error) {
      toast.error("An error occurred while generating payment link", config);
      console.log("Error generating stripe intent:" + error);
    }

    setgeneratingStripeIntent(false);
  };

  if (clientSecret)
    return (
      <div className="w-full max-w-3xl">
        <Toaster />
        <div className="flex items-center">
          <MdArrowBack
            className="text-foreground-secondary text-xl cursor-pointer"
            onClick={() => setClientSecret(null)}
          />

          <LuShoppingBag className="text-2xl text-foreground ml-5 mr-2" />

          <h3 className="text-foreground font-semibold text-lg">
            Payment Summary
          </h3>
        </div>

        <div className="mt-4 mb-6 space-y-1">
          <div className="flex justify-between items-center font-lato">
            <p className="text-foreground font-medium">Total Amount</p>
            <p className="text-3xl text-foreground font-semibold">
              $
              {(1.5 * numberOfCredits).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </p>
          </div>

          <p className="text-sm text-foreground-secondary">
            You will receive{" "}
            <span className="text-foreground font-semibold">
              {numberOfCredits} credits
            </span>{" "}
            after successful payment.
          </p>
        </div>

        <StripePaymentWrapper
          clientSecret={clientSecret}
          credits={numberOfCredits}
          onClose={onClose}
          setrefreshHistory={setrefreshHistory}
        />
      </div>
    );

  return (
    <div className="w-full max-w-3xl">
      <Toaster />
      <p className="text-foreground-secondary">
        Provide the number of credits you want to purchase, were a unit of
        credit(1 credit) ={" "}
        <span className="font-semibold text-foreground">$1.5</span>. Minimum
        number of credits that can be purchased at once is{" "}
        <span className="font-semibold text-foreground">10 credits</span>.
      </p>

      <div className="flex space-x-3 items-end mt-5">
        <div className="space-y-1 w-[50%]">
          <p className="text-sm text-foreground font-medium">Credits</p>
          <input
            value={numberOfCredits}
            onChange={(e) => setnumberOfCredits(Number(e.target.value))}
            type="number"
            className="formInput"
            min={10}
          />
        </div>

        <p className="text-foreground-secondary">
          <LuEqualApproximately className="text-2xl" />
        </p>

        <p className="text-2xl text-foreground font-semibold">
          $
          {(1.5 * numberOfCredits).toLocaleString(undefined, {
            maximumFractionDigits: 2,
          })}
        </p>
      </div>

      <div className="mt-8 flex items-center justify-end">
        <button
          type="button"
          className="px-4 py-2 base-button bg-primary/15 text-primary rounded"
          onClick={() => {
            if (onClose) onClose();
          }}
        >
          Cancel
        </button>

        <button
          className="base-button rounded px-4 py-2 ml-4"
          onClick={generateStripeIntent}
          disabled={generatingStripeIntent}
        >
          {generatingStripeIntent ? "Processing..." : "Proceed to Payment"}
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;
