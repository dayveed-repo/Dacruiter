import { supabase } from "@/app/config/superbase.config";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const now = new Date(moment().format("YYYY-MM-DD")).toISOString();

    // Update all interviews where expirationTime <= now and status is not 'closed'
    const { data, error } = (await supabase
      .from("interviews")
      .update({ status: "closed" })
      .lte("expirationTime", now)
      .neq("status", "closed")) as { data: any[] | null; error: any };

    if (error) {
      return NextResponse.json(
        { error: "Failed to expire interviews" },
        { status: 500 }
      );
    }

    return NextResponse.json({ updated: data?.length || 0 }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to expire interviews" },
      { status: 500 }
    );
  }
}
