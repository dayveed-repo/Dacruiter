import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/config/superbase.config";

export async function POST(req: NextRequest) {
  try {
    const { interviewId, userEmail } = await req.json();

    // 1. Check if interview is active
    const interview = await supabase
      .from("interviews")
      .select("id,maxNumberOfApplicants,status,interviewId")
      .eq("interviewId", interviewId)
      .single();

    if (!interview || !interview.data || interview.error) {
      return NextResponse.json(
        { valid: false, reason: "Unable to access interview." },
        { status: 400 }
      );
    }

    if (interview.data?.status !== "active") {
      return NextResponse.json(
        { valid: false, reason: "Interview is no longer active." },
        { status: 400 }
      );
    }

    // 2. Check if interview limit is exceeded

    if (interview.data?.maxNumberOfApplicants) {
      const sessions = await supabase
        .from("interviewSessions")
        .select("id,interviewId")
        .eq("interviewId", interviewId);

      if (!sessions || !sessions.data || sessions.error) {
        return NextResponse.json(
          { valid: false, reason: "Unable to access interview sessions." },
          { status: 400 }
        );
      }

      if (sessions.data.length >= interview.data.maxNumberOfApplicants) {
        return NextResponse.json(
          { valid: false, reason: "Interview participant limit exceeded." },
          { status: 400 }
        );
      }
    }

    // 3. Check if user already has an interview session
    const existingSession = await supabase
      .from("interviewSessions")
      .select("id,userEmail,interviewId")
      .eq("interviewId", interviewId)
      .eq("userEmail", userEmail)
      .maybeSingle();

    if (!existingSession || existingSession.error) {
      return NextResponse.json(
        { valid: false, reason: "An error occured while validating session." },
        { status: 400 }
      );
    }

    if (existingSession.data?.id) {
      return NextResponse.json(
        {
          valid: false,
          reason: "An existing session already exists for this user.",
        },
        { status: 401 }
      );
    }

    return NextResponse.json({ valid: true });
  } catch (error) {
    console.log("Validate session error: ", error);
    return NextResponse.json(
      { valid: false, reason: "Internal server error." },
      { status: 500 }
    );
  }
}
