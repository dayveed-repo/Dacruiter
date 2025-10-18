import { getAIResponse } from "@/app/config/aiModel";
import { NextRequest, NextResponse } from "next/server";

const PROMPT = `You are an expert technical intervięwer.
Based on the following inputs, generate a well-structured list of high-quality interview questions:
Job Title: ((jobTitle))
Job Description:((jobDescription))
Interview Duration: ((duration))
Interview Type: ((type))
Skills to be evaluated: ((skills))
Your task:
Analyze the job description to identily key responsibilities, required skills, and expected experience.
Generate a list of interview questions depends on interview duration
Adjust the number and depth of questions to match the interview duration.
Ensure the questions match the tone and structure of a real-life ((type)) interview.
Format your response in JSON format with array list of questions no other value included.
format: [
{
    "question": "question text",
    "type": [Technical|Behavioural|Experience|Problem Solving|Managerial]"
},
]
`;

export async function POST(request: NextRequest) {
  try {
    const { title, description, duration, interviewTypes, otherSkills } =
      await request.json();
    if (
      !title ||
      !description ||
      !duration ||
      !interviewTypes ||
      interviewTypes.length === 0
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let prompt = PROMPT.replace("((jobTitle))", title)
      .replace("((jobDescription))", description)
      .replace("((duration))", duration)
      .replace("((type))", interviewTypes.join(", "));

    if (otherSkills && otherSkills.length > 0) {
      let otherSkillsStr = otherSkills.join(", ");
      prompt = prompt.replace("((skills))", otherSkillsStr);
    } else {
      prompt = prompt.replace("Skills to be evaluated: ((skills))", "");
    }

    const response = await getAIResponse(prompt, []);
    if (!response) {
      return NextResponse.json(
        { error: "Failed to get response from AI model" },
        { status: 500 }
      );
    }

    const questions = response.replaceAll("```json", "").replaceAll("```", "");
    const finalQuestions = JSON.parse(questions);

    if (!Array.isArray(finalQuestions)) {
      return NextResponse.json(
        { error: "Invalid response format from AI model" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { questions: finalQuestions.map((item) => ({ ...item, source: "ai" })) },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error", details: error },
      { status: 500 }
    );
  }
}
