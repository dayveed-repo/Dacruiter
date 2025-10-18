import { getAIResponse } from "@/app/config/aiModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { history, message } = await request.json();
    if (!message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const response = await getAIResponse(message, history);
    if (!response) {
      return NextResponse.json(
        { error: "Failed to get response from AI model" },
        { status: 500 }
      );
    }

    return NextResponse.json({ response, success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error", details: error },
      { status: 500 }
    );
  }
}
