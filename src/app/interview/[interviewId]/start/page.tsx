"use client";
import Logo from "@/app/components/Logo";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { TfiTimer } from "react-icons/tfi";
import { IoMicOutline, IoCallOutline } from "react-icons/io5";
import moment from "moment";
import toast, { Toaster } from "react-hot-toast";
import { config } from "@/app/config/toast";
import { getAIAssistantPersonality } from "@/app/helpers/constants";
import Vapi from "@vapi-ai/web";
import Modal from "@/app/components/Modal";

const InterviewSession = () => {
  const { interviewId } = useParams();

  const vapiRef = useRef<Vapi | null>(null);
  const timerIntervalRef = useRef<any>(null);
  const recognitionRef = useRef<any>(null);

  const [interviewData, setinterviewData] = useState<null | {
    [key: string]: any;
  }>(null);
  const [timer, settimer] = useState("00:00:00");
  const [startTime, setstartTime] = useState<Date>();
  const [joinedUser, setjoinedUser] = useState({ username: "", email: "" });
  const [infoText, setinfoText] = useState("Loading Interview Data...");
  const [errorText, seterrorText] = useState("");
  const [userSpeaking, setuserSpeaking] = useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [starting, setstarteing] = useState(false);
  const [endingInterview, setendingInterview] = useState(false);

  // const [history, sethistory] = useState<{ [key: string]: any }[]>([]);
  // const [listening, setListening] = useState(false);
  // const [introAudio, setintroAudio] = useState("");
  const [conversation, setconversation] = useState<
    {
      role: string;
      content: string;
    }[]
  >([]);
  const router = useRouter();

  const fetchInterviewDetails = async (interviewId: string) => {
    seterrorText("");
    const userData = JSON.parse(
      sessionStorage.getItem("decruiter_interview_applicant") || "{}"
    );

    if (!userData || !userData?.email)
      return router.push(`/interview/${encodeURIComponent(interviewId)}`);

    setjoinedUser({
      username: userData.username || "",
      email: userData.email || "",
    });
    try {
      const res = await fetch(
        `/api/get-interview?interviewId=${encodeURIComponent(interviewId)}`
      );
      const data = await res.json();
      if (data?.interview) {
        setinterviewData(data.interview);
        setinfoText("All set...Get started when ready");
      } else {
        seterrorText("Failed to fetch interview data");
      }
    } catch (error) {
      // Optionally, handle error
      seterrorText("Failed to fetch interview data");
      console.error("Error fetching interview details:", error);
    }
  };

  const startTimer = () => {
    const startTime = moment();

    timerIntervalRef.current = setInterval(() => {
      const now = moment();
      const diff = moment.duration(now.diff(startTime));

      const hours = diff.hours();
      const minutes = diff.minutes();
      const seconds = diff.seconds();
      settimer(
        `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`
      );
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerIntervalRef.current);
  };

  const initializeInterview = async (
    interviewData: null | {
      [key: string]: any;
    }
  ) => {
    if (!interviewData?.id || starting) return;
    setinfoText("Initializing Interview...");
    setstarteing(true);

    seterrorText("");
    try {
      const personality = getAIAssistantPersonality(
        joinedUser.username,
        interviewData?.title,
        interviewData?.questions
      );

      if (personality.error || !personality.assistantOptions) {
        console.error("Personality generation error" + personality.error);
        seterrorText(
          "Failed to initialize interview. Please reload to try again"
        );
        setstarteing(false);
        return toast.error(
          "An error occured. Please reload the page to continue"
        );
      }

      if (vapiRef.current) {
        type AssistantDTO = Parameters<(typeof vapiRef.current)["start"]>[0];
        await vapiRef.current?.start(
          personality.assistantOptions as AssistantDTO
        );
      }
      setstarteing(false);
    } catch (error) {
      console.log(error);
      setstarteing(false);
    }
  };

  const endInterview = async () => {
    if (endingInterview) return;
    setendingInterview(true);

    try {
      const response = await fetch("/api/end-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interviewId,
          candidateName: joinedUser.username,
          candidateEmail: joinedUser.email.toLowerCase(),
          conversation,
          startTime,
          endTime: new Date(),
        }),
      });

      const responseData = await response.json();

      if (responseData.success) {
        await vapiRef.current?.stop();
        setinfoText("Interview Ended");
        stopTimer();
        router.replace(`/interview/${interviewData?.interviewId}/completed`);
        setendingInterview(false);
        setShowModal(false);
      } else {
        toast.error(responseData.error || "Failed to end interview", config);
        setendingInterview(false);
      }
    } catch (error) {
      console.log("Failed to end interview: ", error);
      toast.error("Failed to end interview", config);
      setendingInterview(false);
    }
  };

  useEffect(() => {
    if (!vapiRef.current) {
      vapiRef.current = new Vapi(process.env.NEXT_PUBLIC_VAPI_KEY!);
    }
  }, []);

  useEffect(() => {
    fetchInterviewDetails(interviewId as string);
  }, []);

  useEffect(() => {
    if (!interviewData || !interviewData?.id || !vapiRef.current) return;

    const handleSpeechStart = () => setuserSpeaking(false);
    const handleSpeechEnd = () => setuserSpeaking(true);
    const handleCallStart = () => {
      startTimer();
      setinfoText("Interview In Progress...");
      setstartTime(new Date());
    };
    const handleCallEnd = () => {
      stopTimer();
      endInterview();
    };
    const handleMessage = (msg: any) => {
      if (msg?.type === "conversation-update") {
        let conversations: { role: string; content: string }[] = [],
          existingUserMessage = false;
        msg.conversation?.forEach((conv: { role: string; content: string }) => {
          if (conv.role?.toLowerCase() !== "system") {
            conversations = [...conversations, conv];
          }
          if (conv.role?.toLowerCase() === "user") {
            existingUserMessage = true;
          }
        });

        if (existingUserMessage) {
          setconversation(conversations);
        }
      }
    };

    vapiRef.current?.on("speech-start", handleSpeechStart);
    vapiRef.current?.on("speech-end", handleSpeechEnd);
    vapiRef.current?.on("call-start", handleCallStart);
    vapiRef.current?.on("call-end", handleCallEnd);
    vapiRef.current?.on("message", handleMessage);

    return () => {
      vapiRef.current?.off("speech-start", handleSpeechStart);
      vapiRef.current?.off("speech-end", handleSpeechEnd);
      vapiRef.current?.off("call-start", handleCallStart);
      vapiRef.current?.off("call-end", handleCallEnd);
      vapiRef.current?.off("message", handleMessage);
      vapiRef.current?.stop();
      stopTimer();
    };
  }, [interviewData?.id]);

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      toast.error("Speech recognition not supported in this browser", config);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      // setListening(true);
    };

    recognition.onresult = async (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      console.log("🎤 You said:", transcript);

      // Send transcript → Gemini API
      const aiResponse = await fetch("/api/get-ai-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history, message: transcript }),
      });

      const data = await aiResponse.json();

      if (!data?.success) {
        console.error("AI Response error: " + data.error);
        return toast.error(
          "An error occured. Please reload the page to continue"
        );
      }

      const speakResponse = await fetch("/api/ai-speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: data.response }),
      });

      const speakData = await speakResponse.json();

      if (!speakData?.success) {
        console.error("AI Speech error: " + speakData.error);
        return toast.error(
          "An error occured. Please reload the page to continue"
        );
      }

      // Play Gemini reply
      // const audio = new Audio("data:audio/mp3;base64," + speakData.audio);
      const audio = new Audio(speakData.audio);
      audio.onended = () => {
        // // Restart listening only if mic is still ON
        // if (listening) recognition.start();
        // sethistory([
        //   ...history,
        //   {
        //     role: "user",
        //     parts: [
        //       {
        //         text: transcript || "",
        //       },
        //     ],
        //   },
        //   {
        //     role: "model",
        //     parts: [
        //       {
        //         text: data.response,
        //       },
        //     ],
        //   },
        // ]);
      };
      audio.play();
    };

    recognition.onerror = (err: any) => {
      console.error("Recognition error:", err);
      // setListening(false);
    };

    recognition.onend = (event: any) => {
      // Restart only if mic is ON
      // if (listening) recognition.start();
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    // setListening(false);
  };

  // const toggleMic = () => {
  //   if (listening) {
  //     stopListening();
  //   } else {
  //     if (introAudio) {
  //       // const audio = new Audio("data:audio/mp3;base64," + introAudio);
  //       const audio = new Audio(introAudio);
  //       audio.onended = () => {
  //         setintroAudio("");
  //         startListening();
  //       };
  //       audio.play();
  //     } else {
  //       startListening();
  //     }
  //   }
  // };

  return (
    <main className="w-full bg-secondary/10 h-screen flex flex-col pt-10 font-sans">
      <Toaster />
      <div className="w-[90%] mx-auto max-w-4xl">
        <Logo />

        <div className="flex justify-between items-center w-full mt-5">
          <h3 className="text-xl font-medium font-lato">
            Interview:{" "}
            <span className="font-semibold">{interviewData?.title}</span>
          </h3>

          <div className="flex items-center space-x-3 text-xl">
            <TfiTimer className="text-foreground-secondary" />

            <p>{timer}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-5">
          <div className="w-[45%] h-[250px] rounded-3xl flex items-center justify-center bg-white shadow-md">
            {/* <Image  /> */}
            <div className="relative h-max w-max">
              {!userSpeaking && startTime ? (
                <div className="absolute inset-0 h-full w-full bg-primary/10 animate-pulse rounded-full" />
              ) : (
                ""
              )}
              <Image
                src={
                  "https://api.dicebear.com/9.x/micah/svg?glasses=square&mouth=smile&shirtColor=#e96100&hair=dannyPhantom"
                }
                alt={"user"}
                height={0}
                width={0}
                unoptimized
                className="w-[100px] h-[100px] object-cover rounded-full relative"
              />
            </div>
          </div>

          <div className="w-[45%] h-[250px] rounded-3xl flex items-center justify-center bg-white shadow-md">
            {/* <Image  /> */}
            <div className="relative h-max w-max">
              {userSpeaking && startTime ? (
                <div className="absolute inset-0 h-full w-full bg-primary/10 animate-pulse rounded-full" />
              ) : (
                ""
              )}
              <div className="rounded-full h-[80px] w-[80px] uppercase text-center bg-primary text-white flex items-center justify-center text-xl">
                {joinedUser.username.split(" ")[0][0]}{" "}
                {(joinedUser.username.split(" ")[1] &&
                  joinedUser.username.split(" ")[1][0]) ||
                  ""}
              </div>
            </div>
          </div>
        </div>

        <div className="space-x-5 flex justify-center mt-10">
          {!infoText.toLowerCase().includes("in progress") ? (
            <button
              onClick={() => {
                initializeInterview(interviewData);
              }}
              className="base-button"
              disabled={starting}
            >
              {starting ? "Starting..." : "Start Meeting"}
            </button>
          ) : (
            <div
              onClick={() => {
                setShowModal(true);
              }}
              className="text-white bg-red-500 rounded-full flex items-center justify-center h-[50px] w-[50px] cursor-pointer text-xl"
            >
              <IoCallOutline />
            </div>
          )}
        </div>

        <div className="w-full flex justify-center mt-5">
          <p
            className={`${
              errorText ? "text-red-500" : "text-foreground-secondary"
            } text-base font-medium`}
          >
            {errorText ? errorText : infoText}
          </p>
        </div>
      </div>

      <Modal
        open={showModal}
        title="Add Custom Question"
        onClose={() => setShowModal(false)}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            endInterview();
          }}
        >
          <div className="mb-6 space-y-4">
            <h3 className="text-2xl font-bold font-lato">
              End Interview: {interviewData?.title}{" "}
            </h3>
            <p className="text-foreground-secondary text-sm">
              Are you sure you want to end the interview? This action is
              irreversible and you will not be able to continue the session.
            </p>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="px-4 py-2 base-button bg-primary/15 text-primary rounded"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>

            <button
              onClick={endInterview}
              disabled={endingInterview}
              type="submit"
              className="px-4 py-2 base-button rounded"
            >
              {endingInterview ? "Ending..." : "End Call"}
            </button>
          </div>
        </form>
      </Modal>
    </main>
  );
};

export default InterviewSession;
