import { supabase } from "@/app/config/superbase.config";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("interviewId");
  const skip = Number(searchParams.get("skip") || 0);
  const limit = Number(searchParams.get("limit") || 20);

  try {
    if (!id) {
      return NextResponse.json(
        { error: "Interview ID is required." },
        { status: 400 }
      );
    }

    const { data, error, count } = await supabase
      .from("interviewSessions")
      .select("*", { count: "exact" })
      .eq("interviewId", id)
      .range(skip, skip + limit - 1);

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

    return NextResponse.json(
      { success: true, candidates: data, totalCount: count },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching interview candidates:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
