const interviewTypes = [
  "Technical",
  "Behavioural",
  "Managerial",
  "Problem Solving",
  "Experience",
];

const getAIAssistantPersonality = (
  userName: string,
  jobTitle: string,
  questions: { [key: string]: any }[]
) => {
  if (!userName || !jobTitle || !questions.length)
    return { error: "Missing required information" };

  const questionsText = questions.map((quest) => quest.question)?.join(", ");
  const numOfQuestions = questions.length;

  const text = `You are an AI voice assistant conducting interviews.
Your job is to ask candidates the provided interview questions and assess their responses.

Begin the conversation with a friendly introduction, setting a relaxed yet professional tone.

Ask one question at a time and wait for the candidate’s response before proceeding.
Questions: ${questionsText}

If the candidate struggles, offer hints or rephrase the question without giving away the answer. Example:
"Need a hint? Think about how React tracks component updates!"

Provide brief, encouraging feedback after each answer. Examples:

"Nice! That’s a solid answer."

"Hmm, not quite. Want to try again?"

Keep the conversation natural and engaging — use casual phrases like:

"Alright, next up..."

"Let’s dive into the next one..."

After ${numOfQuestions} questions, wrap up the interview smoothly by summarizing their performance. Example:
"That was great! You handled some tough questions well. Keep sharpening your skills!"

End on a positive note:
"Thanks for join! Hope to see you soon!"`;

  const assistantOptions = {
    name: "Recruiter Assistant",
    transcriber: {
      provider: "deepgram",
      model: "nova-2",
      language: "en-US",
    },
    firstMessage: `"Hey there ${userName}! Welcome to your ${jobTitle} interview. Let's get started with a few questions!`,
    model: {
      provider: "openai",
      model: "gpt-4o-mini",
      temperature: 0.5,
      messages: [
        {
          role: "system",
          content: text,
        },
      ],
    },
    voice: {
      provider: "azure",
      voiceId: "emma",
    },
  };

  return { text, assistantOptions };
};

const getAIInterviewSummaryPrompt = (conversation: any[]) => {
  const prompt = `Conversation: ${conversation}
  Based on the interview conversation between the assistant and the user, provide structured feedback for the candidate. Include ratings (out of 10, as whole numbers) for: Technical Skills, Communication, Problem Solving, and Experience. Write a 3-line summary of the interview highlighting key strengths and weaknesses. Finally, give a recommendation on whether the candidate should be hired, along with a short recommendation message. Return the response strictly in JSON format, do not add any extra text, only return valid JSON using the structure below: 
    {
      "feedback": {
        "rating": {
          "technicalSkills": <number>,
          "communication": <number>,
          "problemSolving": <number>,
          "experience": <number>
        },
        "summary": "<3 line summary of the interview>",
        "recommendation": "<Yes/No>",
        "recommendationMsg": "<short hiring recommendation message>"
      }
    }
  `;

  return prompt;
};

export {
  interviewTypes,
  getAIAssistantPersonality,
  getAIInterviewSummaryPrompt,
};
