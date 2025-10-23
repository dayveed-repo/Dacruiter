"use client";
import NewInterViewStep1 from "@/app/components/interview/NewInterViewStep1";
import NewInterviewStep2 from "@/app/components/interview/NewInterviewStep2";
import NewInterviewStep3 from "@/app/components/interview/NewInterviewStep3";
import Stepper from "@/app/components/Stepper";
import { FormType } from "@/app/types";
import React, { useState } from "react";

const CreateInterview = () => {
  const [currentStep, setcurrentStep] = useState(1);
  const [formDetails, setformDetails] = useState<FormType>({
    title: "",
    description: "",
    limitedApplicants: false,
    maxApplicants: 20,
    interviewTypes: [],
    duration: "30",
    otherSkills: [],
  });
  const [generatedQuestions, setgeneratedQuestions] = useState<any[]>([]);
  const [customQuestions, setcustomQuestions] = useState<any[]>([]);
  const [savedInterview, setsavedInterview] = useState<null | {
    [key: string]: any;
  }>(null);
  const [otherCachedSkills, setotherCachedSkills] = useState<
    { title: string; tools: string[] }[] | never[]
  >([]);

  return (
    <div className="py-3">
      <div className="w-full md:w-[60%] md:max-w-2xl space-y-3 mx-auto flex flex-col items-center">
        <Stepper currentStep={currentStep} numberOfSteps={3} />

        <div className="p-5 rounded-2xl shadow-md bg-white w-full">
          {currentStep === 1 ? (
            <NewInterViewStep1
              cachedOtherSkills={otherCachedSkills}
              setCachedOtherSkills={setotherCachedSkills}
              setformDetails={setformDetails}
              formDetails={formDetails}
              setgeneratedQuestions={setgeneratedQuestions}
              setCurrentStep={setcurrentStep}
            />
          ) : currentStep === 2 ? (
            <NewInterviewStep2
              generatedQuestions={generatedQuestions}
              setgeneratedQuestions={setgeneratedQuestions}
              customQuestions={customQuestions}
              setcustomQuestions={setcustomQuestions}
              setCurrentStep={setcurrentStep}
              setSavedInterview={setsavedInterview}
              formData={formDetails}
            />
          ) : currentStep === 3 ? (
            <NewInterviewStep3 interview={savedInterview} />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CreateInterview;
