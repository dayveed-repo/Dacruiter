import { supabase } from "@/app/config/superbase.config";
import { getInterviewCredits } from "@/app/helpers/general";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";
import { v4 } from "uuid";

export async function POST(req: NextRequest) {
  const {
    title,
    description,
    interviewTypes,
    duration,
    otherSkills,
    limitedApplications,
    maxApplicants,
    questions,
    userEmail,
    userSupabaseId,
  } = await req.json();

  // Validate required fields
  try {
    if (
      !title ||
      !description ||
      !interviewTypes ||
      !interviewTypes.length ||
      !duration ||
      !userEmail ||
      !userSupabaseId
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!questions || !questions.length) {
      return NextResponse.json(
        { error: "Interview must contain at least one question" },
        { status: 400 }
      );
    }

    const userData = await supabase
      .from("users")
      .select("numOfCredits")
      .eq("email", userEmail)
      .single();

    if (userData?.error || !userData?.data) {
      return NextResponse.json(
        { error: "Unable to fetch user data" },
        { status: 422 }
      );
    }

    const interviewCreditCost = getInterviewCredits(questions.length) || 1;

    if (userData?.data?.numOfCredits < interviewCreditCost) {
      return NextResponse.json(
        {
          error: `Insufficient credits to create interview. Interview cost ${interviewCreditCost} credit(s)`,
        },
        { status: 403 }
      );
    }

    const numberOfTechnicalQuestions = questions.filter(
      (q: any) => q.type.toLowerCase() === "technical"
    ).length;
    const numberOfBehaviouralQuestions = questions.filter(
      (q: any) => q.type.toLowerCase() === "behavioural"
    ).length;
    const numberOfManagerialQuestions = questions.filter(
      (q: any) => q.type.toLowerCase() === "managerial"
    ).length;
    const numberOfExperienceQuestions = questions.filter(
      (q: any) => q.type.toLowerCase() === "experience"
    ).length;
    const numberOfProblemSolvingQuestions = questions.filter(
      (q: any) => q.type.toLowerCase() === "problem solving"
    ).length;

    const interviewId = v4();

    const savedInterview = await supabase
      .from("interviews")
      .insert({
        title,
        description,
        interviewTypes: interviewTypes,
        duration: Number(duration),
        otherSkills: otherSkills,
        limitedApplicants: limitedApplications,
        maxNumberOfApplicants: limitedApplications ? maxApplicants : 0,
        userSupabaseId: userSupabaseId,
        userEmail: userEmail,
        questions,
        numberOfQuestions: questions.length,
        numberOfTechnicalQuestions: numberOfTechnicalQuestions,
        numberOfBehaviouralQuestions: numberOfBehaviouralQuestions,
        numberOfManagerialQuestions: numberOfManagerialQuestions,
        numberOfExperienceQuestions: numberOfExperienceQuestions,
        numberOfProblemSolvingQuestions: numberOfProblemSolvingQuestions,
        status: "active",
        interviewId: interviewId,
        expiresAt: moment().add(30, "days").toISOString(),
      })
      .select()
      .single();

    if (savedInterview.error) {
      return NextResponse.json(
        { error: savedInterview.error.message },
        { status: 422 }
      );
    }

    // Deduct credits from user
    const updatedCredits = await supabase
      .from("users")
      .update({
        numOfCredits: (userData?.data?.numOfCredits || 1) - interviewCreditCost,
        totalUsedCredits:
          ((userData?.data as { [key: string]: any })?.totalUsedCredits || 0) +
          interviewCreditCost,
      })
      .eq("email", userEmail)
      .select()
      .single();

    if (updatedCredits.error) {
      await supabase.from("interviews").delete().eq("interviewId", interviewId);

      console.error("Error updating user credits:", updatedCredits.error);
      return NextResponse.json(
        { error: "Error occured while creating interview" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Interview created",
      savedInterview,
    });
  } catch (error) {
    console.error("Error creating interview:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
