// import textToSpeech from "@google-cloud/text-to-speech";

import { Client } from "@gradio/client";

export const aiSpeak = async (text: string) => {
  if (!text) return { error: "Text is required" };

  try {
    const client = await Client.connect("ruslanmv/text-to-speech-fast");
    const result = await client.predict("/process", {
      language: "English",
      repo_id: "csukuangfj/vits-piper-en_US-hfc_female-medium|1 speaker",
      text: text,
      sid: "2",
    });

    const audioUrl = Array.isArray(result.data) ? result.data[0] : null;

    if (!audioUrl) {
      return { success: false, error: "No audio URL in response" };
    }

    return { success: true, audio: audioUrl };

    // const audio = await client.textToSpeech({
    //   provider: "auto",
    //   model: "facebook/mms-tts-eng",
    //   inputs: text,
    // });

    // if (!audio) {
    //   return { error: "Failed to get audio" };
    // }

    // const url = URL.createObjectURL();
    // return { audio: url };
  } catch (error) {
    console.error("An error occured while speaking" + error);
  }
};
