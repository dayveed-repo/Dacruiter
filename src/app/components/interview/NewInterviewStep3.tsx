import { FaCheckCircle } from "react-icons/fa";
import React from "react";
import InterviewLink from "./InterviewLink";

const NewInterviewStep3 = ({
  interview,
}: {
  interview: null | { [key: string]: any };
}) => {
  return (
    <div>
      <div className="flex flex-col items-center">
        <FaCheckCircle className="text-6xl text-green-500 mb-4" />
        <h2 className="text-2xl font-semibold text-foreground">
          AI Interview Created Successfully!
        </h2>
        <p className="text-sm font-medium text-foreground-secondary mt-2">
          Share details of interview to candidates to receive applications for
          the job
        </p>
      </div>

      <InterviewLink
        title={interview?.title}
        duration={interview?.duration || 0}
        expDate={interview?.expiresAt}
        interviewId={interview?.interviewId || ""}
        numOfQuestions={interview?.numberOfQuestions || 0}
      />
    </div>
  );
};

export default NewInterviewStep3;
