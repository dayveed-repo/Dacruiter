import { getAIResponse } from "@/app/config/aiModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Example: Return a static list of skills
  const { title, description } = await req.json();

  try {
    if (!title || !description) {
      return NextResponse.json(
        { message: "Title and Description are required" },
        { status: 400 }
      );
    }
    const response = await getAIResponse(
      `Generate an array of objects in a structured format of title and tools, for skills and tools for the following job description. Job Title: ${title}, Job Description: ${description}. Response should be strictly in JSON format only.`,
      []
    );

    if (!response) {
      return NextResponse.json(
        { message: "Failed to fetch skills from AI" },
        { status: 500 }
      );
    }

    const skills = response.replaceAll("```json", "").replaceAll("```", "");
    const finalSkills = JSON.parse(skills) as {
      title: string;
      tools: string[];
    }[];

    return NextResponse.json({ skills: finalSkills }, { status: 200 });
  } catch (error) {
    NextResponse.json({ message: "Failed to fetch skills" }, { status: 500 });
  }
}
