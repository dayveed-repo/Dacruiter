import { aiSpeak } from "@/app/helpers/aiFuntions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();
    if (!text) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const audioData = await aiSpeak(text);

    if (!audioData?.success || !audioData.audio?.url) {
      console.log("Fetch Audio Error: ", audioData);
      return NextResponse.json(
        { error: "Failed to get audio data" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { audio: audioData.audio?.url, success: true },
      { status: 200 }
    );

    // const ttsRes = await fetch(
    //   "https://api.elevenlabs.io/v1/text-to-speech/FGY2WhTYpPnrIDTdsKH5",
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       "xi-api-key": process.env.ELEVENLABS_API_KEY!,
    //     },
    //     body: JSON.stringify({
    //       text,
    //       voice_settings: { stability: 0.5, similarity_boost: 0.8 },
    //     }),
    //   }
    // );

    // if (!ttsRes.ok) {
    //   const err = await ttsRes.text();
    //   return NextResponse.json({ error: err }, { status: 500 });
    // }

    // // Convert audio (MP3) → Base64
    // const arrayBuffer = await ttsRes.arrayBuffer();
    // const audioBase64 = Buffer.from(arrayBuffer).toString("base64");
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error", details: error },
      { status: 500 }
    );
  }
}
