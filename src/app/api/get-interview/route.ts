import { supabase } from "@/app/config/superbase.config";
import { NextRequest, NextResponse } from "next/server";

// GET /api/get-interview?interviewId=INTERVIEW_ID
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("interviewId");

  try {
    if (!id) {
      return NextResponse.json(
        { error: "Interview ID is required." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("interviews")
      .select("*")
      .eq("interviewId", id)
      .single();

    if (error) {
      console.error("Supabase error:", error);
      if (error.code === "PGRST116") {
        // Not found
        return NextResponse.json(
          { error: "Interview not found." },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: "Failed to fetch interview." },
        { status: 400 }
      );
    }

    const sessions = await supabase
      .from("interviewSessions")
      .select("*", { count: "exact" }) // options: exact | planned | estimated
      .eq("interviewId", id);

    if (!sessions || sessions.error) {
      console.error("Error fetching sessions count:", error);
      return NextResponse.json(
        { error: "Failed to fetch interview." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, interview: data, sessionCount: sessions.count },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching interview:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
