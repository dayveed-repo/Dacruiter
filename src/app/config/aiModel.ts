import { GoogleGenAI } from "@google/genai";

const tools = [
  {
    googleSearch: {},
  },
];

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const model = "gemini-2.5-flash";
const config = {
  thinkingConfig: {
    thinkingBudget: -1,
  },
  tools,
};

export async function getAIResponse(
  prompt: string,
  history: {
    role: string;
    parts: {
      text: string;
    }[];
  }[]
) {
  const contents = [
    ...history,
    {
      role: "user",
      parts: [
        {
          text: prompt,
        },
      ],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });

  let responseText = "";
  for await (const chunk of response) {
    responseText += chunk.text;
  }

  return responseText;
}
