import { getAIResponse } from "@/app/config/aiModel";
import { supabase } from "@/app/config/superbase.config";
import { getAIInterviewSummaryPrompt } from "@/app/helpers/constants";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Parse request body (e.g., interviewId)
    const {
      interviewId,
      candidateName,
      candidateEmail,
      startTime,
      endTime,
      conversation,
    } = await req.json();

    if (
      !interviewId ||
      !candidateName ||
      !candidateEmail ||
      !startTime ||
      !conversation
    ) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const conversationString = conversation
      ?.map((m: { role: string; content: string }) => `${m.role}: ${m.content}`)
      .join("\n");

    const conversationPrompt = getAIInterviewSummaryPrompt(conversationString);

    if (!conversationPrompt) {
      return NextResponse.json(
        { error: "An error occured while ending interview" },
        { status: 422 }
      );
    }

    const aiResponse = await getAIResponse(conversationPrompt, []);

    if (!aiResponse) {
      return NextResponse.json(
        { error: "An error occured while ending interview" },
        { status: 422 }
      );
    }

    const summary = aiResponse.replaceAll("```json", "").replaceAll("```", "");
    const finalSummary = JSON.parse(summary);

    if (!finalSummary) {
      return NextResponse.json(
        { error: "Invalid response format from AI model" },
        { status: 500 }
      );
    }

    const { feedback = {} } = finalSummary;
    let averageRating =
      (feedback?.rating?.technicalSkills || 0) +
      (feedback?.rating?.communication || 0) +
      (feedback?.rating?.problemSolving || 0) +
      (feedback?.rating?.experience || 0);
    averageRating = averageRating / 4;

    const savedSession = await supabase
      .from("interviewSessions")
      .insert([
        {
          interviewId,
          username: candidateName,
          userEmail: candidateEmail,
          feedback: feedback,
          averageRating,
          isRecommended: finalSummary.recommendation?.toLowerCase() === "yes",
          startTime,
          endTime,
        },
      ])
      .select()
      .single();

    if (savedSession.error || !savedSession.data || !savedSession.data.id) {
      console.log("Failed to end interview: ", savedSession?.error?.message);
      return NextResponse.json(
        { error: "Failed to end interview" },
        { status: 422 }
      );
    }

    const conversationToProcess = conversation.map(
      (con: { role: string; content: string }) => {
        return {
          message: con.content || "",
          messageSource: con.role || "",
          interviewId: interviewId,
          interviewSessionId: savedSession.data?.id || "",
        };
      }
    );

    const savedTranscripts = await supabase
      .from("transcripts")
      .insert(conversationToProcess)
      .select();

    if (!savedTranscripts || savedTranscripts.error) {
      await supabase
        .from("interviewSessions")
        .delete()
        .eq("interviewId", interviewId);

      console.log(
        "Failed to end interview: ",
        savedTranscripts?.error?.message
      );

      return NextResponse.json(
        { error: "Failed to end interview" },
        { status: 422 }
      );
    }

    return NextResponse.json({ success: true, savedSession }, { status: 200 });
  } catch (error) {
    console.log("Failed to end interview: ", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
