import {
  handleFailedPayment,
  handleProcessingPayment,
  handleSuccessfulPayment,
} from "@/app/helpers/payment";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text(); // get raw body
  const sig = req.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // ✅ Handle different event types
  try {
    const paymentIntentId = (event.data.object as any).id || "";
    const metaData = (event.data.object as any).metadata || {
      numberOfCredits: 0,
      amount: 0,
      userEmail: "",
      supabaseUserId: "",
    };
    console.log(event);

    let paymentResponse;

    switch (event.type) {
      case "payment_intent.processing": {
        paymentResponse = await handleProcessingPayment(
          paymentIntentId,
          metaData
        );
        break;
      }
      case "payment_intent.payment_failed": {
        paymentResponse = await handleFailedPayment(paymentIntentId, metaData);
        break;
      }
      case "payment_intent.succeeded": {
        paymentResponse = await handleSuccessfulPayment(
          paymentIntentId,
          metaData
        );
        break;
      }
      default:
        console.log(`Unhandled event type from stripe: ${event.type}`);
    }

    if (paymentResponse?.error) {
      return NextResponse.json(
        { error: paymentResponse.error },
        { status: 403 }
      );
    }

    return NextResponse.json(paymentResponse, { status: 200 });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
