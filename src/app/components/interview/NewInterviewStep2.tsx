"use client";
import { FormType } from "@/app/types";
import React, { use, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { MdChevronLeft, MdDelete } from "react-icons/md";
import Modal from "../Modal";
import { interviewTypes } from "@/app/helpers/constants";
import useUser from "@/app/hooks/getUser";
import { useRouter } from "next/navigation";

const NewInterviewStep2 = ({
  generatedQuestions,
  setCurrentStep,
  formData,
  setgeneratedQuestions,
  customQuestions,
  setcustomQuestions,
  setSavedInterview,
}: {
  generatedQuestions: any[];
  setgeneratedQuestions: React.Dispatch<React.SetStateAction<any[]>>;
  customQuestions: any[];
  setcustomQuestions: React.Dispatch<React.SetStateAction<any[]>>;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  setSavedInterview: React.Dispatch<
    React.SetStateAction<null | { [key: string]: any }>
  >;
  formData: FormType;
}) => {
  // const [showModal, setShowModal] = React.useState(false);
  // const [customQuestion, setCustomQuestion] = React.useState("");
  // const [customType, setCustomType] = React.useState("");
  const [generatingQuestions, setgeneratingQuestions] = useState(false);
  const [user] = useUser();
  const router = useRouter();

  const generateQuestions = async () => {
    setgeneratingQuestions(true);

    try {
      const response = await fetch("/api/create-interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          duration: formData.duration,
          interviewTypes: formData.interviewTypes,
          otherSkills: formData.otherSkills,
          limitedApplications: formData.limitedApplicants,
          maxApplicants: Number(formData.maxApplicants || 0),
          questions: generatedQuestions,
          userEmail: user?.email,
          userSupabaseId: user?.supabaseUserId,
        }),
      });

      const data = await response.json();
      console.log("Response from create interview:", data);
      if (data?.success && data?.savedInterview?.data) {
        toast.success("Interview saved successfully successfully");
        setSavedInterview(data.savedInterview.data);
        setCurrentStep(3);
      } else {
        // Handle error
        toast.error(data.error || "Failed to generate questions");
      }
    } catch (error) {
      // Handle error
      toast.error("Failed to create interview");
      console.error("Error generating questions:", error);
    }
    setgeneratingQuestions(false);
  };

  return (
    <div>
      <Toaster />
      <div className="flex space-x-3">
        <MdChevronLeft
          className="text-2xl text-foreground-secondary cursor-pointer"
          onClick={() => {
            setCurrentStep(1);
            setcustomQuestions([]); // Clear custom questions when going back
          }}
        />

        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Generated Questions
          </h3>
          <p className="text-sm text-foreground-secondary mt-1">
            List of AI generated questions for new interview.
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3 divide-y divide-foreground-secondary/60">
        {generatedQuestions.length === 0 ? (
          <p className="text-sm text-foreground-secondary">
            No questions generated yet.
          </p>
        ) : (
          generatedQuestions?.map((item, index) => (
            <div key={index} className="space-y-1.5 py-2">
              <p className="text-sm font-medium">{item?.question}</p>
              <div className="flex space-x-5 justify-between items-center">
                <p className="text-sm text-foreground-secondary">
                  Type:{" "}
                  <span className="text-primary-blue">{item?.type || ""}</span>
                </p>

                <MdDelete
                  className="cursor-pointer text-foreground-secondary hover:text-red-600 transition-all"
                  onClick={() => {
                    setgeneratedQuestions(
                      generatedQuestions.filter((_, i) => i !== index)
                    );
                  }}
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Custom Questions Section */}
      {/* <div className="mt-8 flex items-center justify-between">
        <h4 className="text-md font-semibold text-foreground mb-2">
          Custom Questions
        </h4>
        <button
          className="base-button text-xs px-2 py-1.5"
          onClick={() => setShowModal(true)}
        >
          + Add Custom Question
        </button>
      </div> */}

      {/* Modal for adding custom question */}
      {/* <Modal
        open={showModal}
        title="Add Custom Question"
        onClose={() => setShowModal(false)}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (customQuestion.trim()) {
              setcustomQuestions([
                ...customQuestions,
                {
                  question: customQuestion,
                  type: customType,
                  source: "custom",
                },
              ]);
              setCustomQuestion("");
              setCustomType("");
              setShowModal(false);
            }
          }}
        >
          <div className="mb-3">
            <label className="formLabel">Question</label>
            <input
              type="text"
              className="formInput"
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="formLabel">Type</label>
            <select
              className="formInput"
              value={customType}
              required
              onChange={(e) => setCustomType(e.target.value)}
            >
              <option value="">Select Type</option>
              {interviewTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="px-4 py-2 base-button bg-primary/15 text-primary rounded"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>

            <button type="submit" className="px-4 py-2 base-button rounded">
              Add
            </button>
          </div>
        </form>
      </Modal> */}

      {/* State for modal and custom question */}
      {/* <div className="space-y-3 divide-y divide-foreground-secondary/60">
        {customQuestions
          .filter((item) => item.source === "custom")
          .map((item, index) => (
            <div key={index} className="space-y-1.5 py-2">
              <p className="text-sm font-medium">{item?.question}</p>
              <div className="flex space-x-5 justify-between items-center">
                <p className="text-sm text-foreground-secondary">
                  Type:{" "}
                  <span className="text-primary-blue">{item?.type || ""}</span>
                </p>

                <MdDelete
                  className="cursor-pointer text-foreground-secondary hover:text-red-600 transition-all"
                  onClick={() => {
                    setcustomQuestions(
                      customQuestions.filter((_, i) => i !== index)
                    );
                  }}
                />
              </div>
            </div>
          ))}
      </div> */}

      <button
        disabled={generatingQuestions}
        onClick={generateQuestions}
        className={`base-button rounded-lg w-full mt-2 ${
          generatingQuestions
            ? "opacity-70 cursor-not-allowed"
            : "cursor-pointer"
        }`}
      >
        {generatingQuestions ? "Creating Interview..." : "Create Interview"}
      </button>
    </div>
  );
};

export default NewInterviewStep2;
