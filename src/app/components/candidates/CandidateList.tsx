"use client";
import moment from "moment";
import Modal from "../Modal";
import { useEffect, useState } from "react";
import Assessment from "./Assessment";
import { supabase } from "@/app/config/superbase.config";

const CandidateList = ({
  candidateName,
  candidateEmail,
  averageScore,
  dateCompleted,
  startTime,
  endTime,
  isRecommended,
  feedback,
  sessionId,
}: {
  candidateName: string;
  candidateEmail: string;
  averageScore: number;
  dateCompleted: string;
  startTime: string;
  endTime: string;
  isRecommended: boolean;
  feedback: { [key: string]: any };
  sessionId: number;
}) => {
  const [showModal, setShowModal] = useState(false);
  const [transcripts, settranscripts] = useState<any[]>([]);

  const fetchTranscripts = async () => {
    try {
      if (!sessionId) return;
      const { data, count, error } = await supabase
        .from("transcripts")
        .select("*", { count: "exact" })
        .eq("interviewSessionId", sessionId);

      if (error) {
        console.error("Error fetching transcripts:", error);
        return;
      }

      settranscripts(data || []);
    } catch (error) {
      console.error("Error fetching transcripts:", error);
    }
  };

  useEffect(() => {
    if (!transcripts.length && showModal) {
      fetchTranscripts();
    }
  }, [showModal]);

  return (
    <div className="flex items-center justify-between py-2">
      <div className="space-y-1">
        <h4 className="text-base font-semibold text-foreground">
          {candidateName}
        </h4>

        <p className="text-xs text-foreground-secondary">
          {moment(dateCompleted).format("MMMM Do YYYY")} |{" "}
          {moment(startTime).format("h:mm A")} -{" "}
          {moment(endTime).format("h:mm A")}
        </p>
      </div>

      <div className="flex items-center space-x-3">
        <p className="text-primary text-base font-semibold">
          {Number((averageScore || 0).toFixed(2))}/10
        </p>

        <button
          className="base-button bg-primary/10 rounded-lg text-primary px-4 py-2"
          onClick={() => setShowModal(true)}
        >
          View Result
        </button>
      </div>

      <Modal
        open={showModal}
        title="View Candidate Result"
        onClose={() => setShowModal(false)}
      >
        <div className="w-full max-w-4xl">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h4 className="text-2xl font-semibold text-foreground">
                  {candidateName}
                </h4>

                <p className="font-medium text-foreground-secondary text-sm">
                  ({candidateEmail})
                </p>
              </div>

              <p className="text-sm text-foreground-secondary">
                Completed On: {moment(dateCompleted).format("MMMM Do YYYY")} |{" "}
                {moment(startTime).format("h:mm A")} -{" "}
                {moment(endTime).format("h:mm A")}
              </p>
            </div>

            <p className="text-base text-foreground-secondary/40 font-semibold">
              <span
                className="text-xl"
                style={{ color: isRecommended ? "#10B981" : "#DC2626" }}
              >
                {Number((averageScore || 0).toFixed(2))}
              </span>{" "}
              /10
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <h3 className="text-lg font-medium">Assesment</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Assessment
                title="Technical Skills"
                score={feedback?.rating?.technicalSkills || 0}
              />
              <Assessment
                title="Communication"
                score={feedback?.rating?.communication}
              />
              <Assessment
                title="Problem Solving"
                score={feedback?.rating?.problemSolving}
              />
              <Assessment
                title="Experience"
                score={feedback?.rating?.experience}
              />
            </div>
          </div>

          <div className="space-y-2.5 mb-6">
            <h3 className="text-lg font-medium">Performance Summary</h3>

            <div className="mt-2 min-h-32 w-full bg-foreground-secondary/10 border border-foreground-secondary/20 rounded-lg p-4">
              <p className="text-sm text-foreground">
                {feedback.summary || ""}
              </p>
            </div>
          </div>

          <div className="space-y-2.5 mb-6">
            <h3 className="text-lg font-medium">Recommendation</h3>

            <div
              className="mt-2 w-full rounded-lg p-4"
              style={{
                backgroundColor: isRecommended
                  ? "rgba(16, 185, 129, 0.1)"
                  : "rgba(220, 38, 38, 0.1)",
                border: isRecommended
                  ? "1px solid rgba(16, 185, 129, 0.5)"
                  : "1px solid rgba(220, 38, 38, 0.5)",
                color: isRecommended ? "#10B981" : "#DC2626",
              }}
            >
              <p className="text-sm">{feedback.recommendationMsg || ""}</p>
            </div>
          </div>

          <div className="space-y-2.5">
            <h3 className="text-lg font-medium">Transcripts</h3>

            <div className="mt-2  w-full bg-foreground-secondary/10 border border-foreground-secondary/20 rounded-lg p-4">
              {transcripts.length ? (
                <>
                  {transcripts.map((tran) => (
                    <div
                      key={tran.id}
                      className="mb-2 last:mb-0 space-x-2 flex items-start"
                    >
                      <h4 className="text-sm font-semibold text-foreground md:w-[20%] lg:w-[15%]">
                        {tran.messageSource === "assistant"
                          ? "Ai Assistant"
                          : candidateName}{" "}
                        :
                      </h4>
                      <p className="text-sm text-foreground-secondary md:max-w-[80%] lg:w-[85%]">
                        {tran.message}
                      </p>
                    </div>
                  ))}
                </>
              ) : (
                <p className="text-sm text-foreground-secondary">
                  No transcripts available.
                </p>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CandidateList;
