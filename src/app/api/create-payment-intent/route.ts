import { convertToSubcurrency } from "@/app/helpers/general";
import { NextRequest, NextResponse } from "next/server";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(request: NextRequest) {
  try {
    const { numberOfCredits, userEmail, supabaseUserId } = await request.json();

    const metadata = {
      numberOfCredits,
      amount: numberOfCredits * 1.5,
      userEmail,
      supabaseUserId,
    };

    const paymentIntent = await stripe.paymentIntents.create({
      amount: convertToSubcurrency(numberOfCredits * 1.5),
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata,
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Internal Error:", error);
    // Handle other errors (e.g., network issues, parsing errors)
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  }
}
