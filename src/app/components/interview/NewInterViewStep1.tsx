"use client";
import { config } from "@/app/config/toast";
import { FormType } from "@/app/types";
import { duration } from "moment";
import { Limelight } from "next/font/google";
import React, { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  MdOutlineCheckBoxOutlineBlank,
  MdCheckBox,
  MdOutlineCheckBox,
} from "react-icons/md";
import Spinner from "../Spinner";
import { interviewTypes } from "@/app/helpers/constants";
import { title } from "process";

const NewInterViewStep1 = ({
  formDetails,
  setformDetails,
  setgeneratedQuestions,
  setCurrentStep,
  setCachedOtherSkills,
  cachedOtherSkills,
}: {
  formDetails: FormType;
  setformDetails: React.Dispatch<React.SetStateAction<FormType>>;
  setgeneratedQuestions: React.Dispatch<React.SetStateAction<any[]>>;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  cachedOtherSkills:
    | {
        title: string;
        tools: string[];
      }[]
    | never[];
  setCachedOtherSkills: React.Dispatch<
    React.SetStateAction<
      | {
          title: string;
          tools: string[];
        }[]
      | never[]
    >
  >;
}) => {
  const [formData, setformData] = useState<FormType>(
    formDetails || {
      title: "",
      description: "",
      limitedApplicants: false,
      maxApplicants: 20,
      interviewTypes: [],
      duration: "30",
      otherSkills: [],
    }
  );

  const [otherSkills, setotherSkills] = useState<
    { title: string; tools: string[] }[] | never[]
  >(cachedOtherSkills || []);
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);
  const [genratingQuestions, setgenratingQuestions] = useState(false);
  const [fetchingOtherSkills, setfetchingOtherSkills] = useState(false);

  const handleTypesSelection = (
    field: "interviewTypes" | "otherSkills",
    val: string
  ) => {
    setformData({
      ...formData,
      [field]: formData[field].includes(val)
        ? formData[field].filter((t) => t !== val)
        : [...formData[field], val],
    });
  };

  const handleInputChange = (
    field:
      | "title"
      | "description"
      | "limitedApplicants"
      | "maxApplicants"
      | "duration",
    val: string
  ) => {
    setformData({
      ...formData,
      [field]: val,
    });

    if (field === "title" || field === "description") {
      setotherSkills([]);
    }
  };

  const fetchOtherSkills = async () => {
    // Mock API call - Replace with actual API call
    setfetchingOtherSkills(true);
    const response = await fetch("/api/get-skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formData.title,
        description: formData.description,
      }),
    });

    const data = await response.json();
    if (data && data?.skills && data?.skills?.length > 0) {
      setotherSkills(data.skills);
      setCachedOtherSkills(data.skills);
    }
    setfetchingOtherSkills(false);
  };

  const generateQuestions = async () => {
    // Mock API call - Replace with actual API call
    const required = [
      {
        label: "Title",
        value: formData.title,
      },
      { label: "Description", value: formData.description },
      {
        label: "Interview Types",
        value: formData.interviewTypes,
      },
      {
        label: "Max Applicants",
        value: formData.maxApplicants,
      },
      {
        label: "Duration",
        value: formData.duration,
      },
    ];

    try {
      for (let i = 0; i < required.length; i++) {
        if (!required[i].value) {
          toast.error(`${required[i].label} is required`, config);
          return;
        }

        if (Array.isArray(required[i].value)) {
          // @ts-ignore
          if (required[i].value?.length === 0) {
            toast.error(`${required[i].label} is required`, config);
            return;
          }
        }
      }

      setgenratingQuestions(true);

      const response = await fetch("/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data && data?.questions) {
        setgeneratedQuestions(data.questions);
        setformDetails(formData);
        setgenratingQuestions(false);
        setCurrentStep(2);
        toast.success("Questions generated successfully", config);
      } else {
        setgenratingQuestions(false);
        toast.error("Failed to generate questions", config);
      }
    } catch (error) {
      console.log("Error generating questions:", error);
      setgenratingQuestions(false);
      toast.error("An error occurred while generating questions", config);
    }
  };

  useEffect(() => {
    if (formData.title && formData.description && !otherSkills.length) {
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
      }

      saveTimeout.current = setTimeout(() => {
        fetchOtherSkills();
      }, 3000);
    }
  }, [formData.title, formData.description]);

  return (
    <div>
      <Toaster />
      <h3 className="text-lg font-semibold text-foreground">
        Interview Details
      </h3>

      <p className="text-sm text-foreground-secondary mt-1">
        Please provide the following details to create a new interview.
      </p>

      <div className="mt-4 space-y-4">
        <div>
          <label className="formLabel">Job Title</label>
          <input
            type="text"
            className="formInput"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="e.g. Software Engineer - Frontend"
          />
        </div>

        <div>
          <label className="formLabel">Job Description</label>
          <textarea
            className="formInput"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="e.g. We are looking for a skilled frontend developer..."
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            {!formData.limitedApplicants ? (
              <MdOutlineCheckBoxOutlineBlank
                className="w-6 h-6 text-foreground-secondary cursor-pointer"
                onClick={() =>
                  setformData({
                    ...formData,
                    limitedApplicants: !formData.limitedApplicants,
                  })
                }
              />
            ) : (
              <MdOutlineCheckBox
                className="w-6 h-6 text-primary cursor-pointer"
                onClick={() =>
                  setformData({
                    ...formData,
                    limitedApplicants: !formData.limitedApplicants,
                  })
                }
              />
            )}

            <label className="formLabel mb-0">
              Do you want a limited number of applicants?
            </label>
          </div>

          {formData.limitedApplicants && (
            <div>
              <label className="formLabel">Maximum Number Of Applicants</label>
              <input
                type="number"
                className="formInput"
                value={formData.maxApplicants}
                onChange={(e) =>
                  handleInputChange("maxApplicants", e.target.value)
                }
              />
            </div>
          )}
        </div>

        <div>
          <label className="formLabel">Interview Type</label>

          <div className="flex gap-x-3 gap-y-2 overflow-x-auto py-2 flex-wrap">
            {interviewTypes.map((type) => (
              <div
                key={type}
                onClick={() => {
                  handleTypesSelection("interviewTypes", type);
                }}
                className={`px-4 py-2 rounded-full border ${
                  formData.interviewTypes.includes(type)
                    ? "border-primary text-primary font-medium bg-primary/15"
                    : "border-gray-300"
                } text-sm w-max cursor-pointer`}
              >
                {type}
              </div>
            ))}
          </div>
        </div>

        {fetchingOtherSkills && (
          <div className="w-full text-center text-sm">
            <span className="inline-block align-middle mr-2">
              <Spinner />
            </span>
            Fetching relevant technical skills and tools...
          </div>
        )}

        {otherSkills.length > 0 && (
          <div>
            <label className="formLabel">
              Technical Skills and Tools Based on Role{" "}
              <span className="text-foreground-secondary">(Optional)</span>
            </label>

            <div className="space-y-2">
              {otherSkills.map((skill) => (
                <div key={skill.title} className={`space-y-1`}>
                  <h4 className="text-foreground-secondary text-sm font-medium">
                    {skill?.title}
                  </h4>

                  <div className="flex gap-x-3 gap-y-2 overflow-x-auto py-2 flex-wrap">
                    {skill.tools.map((tool) => (
                      <div
                        key={tool}
                        onClick={() => {
                          handleTypesSelection("otherSkills", tool);
                        }}
                        className={`px-4 py-2 rounded-full border ${
                          formData.otherSkills.includes(tool)
                            ? "border-primary text-primary font-medium bg-primary/15"
                            : "border-gray-300"
                        } text-xs w-max cursor-pointer`}
                      >
                        {tool}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="formLabel">Interview Duration</label>
          <select
            className="formInput"
            value={formData.duration}
            onChange={(e) => handleInputChange("duration", e.target.value)}
          >
            <option value="5">5 Minutes</option>
            <option value="15">15 Minutes</option>
            <option value="30">30 Minutes</option>
            <option value="45">45 Minutes</option>
            <option value="60">60 Minutes</option>
            <option value="90">90 Minutes</option>
            <option value="120">120 Minutes</option>
          </select>
        </div>

        {genratingQuestions ? (
          <div className="w-full text-center rounded-2xl p-3 border border-primary text-sm text-primary bg-primary/15">
            <span className="inline-block align-middle mr-2">
              <Spinner />
            </span>
            Generating Questions for {formData.title}... Please wait while the
            AI generates your pictures.
          </div>
        ) : (
          <button
            disabled={genratingQuestions}
            onClick={generateQuestions}
            className={`base-button rounded-lg w-full mt-2 ${
              genratingQuestions
                ? "opacity-70 cursor-not-allowed"
                : "cursor-pointer"
            }`}
          >
            {genratingQuestions
              ? "Generating Questions..."
              : "Generate Questions"}
          </button>
        )}
      </div>
    </div>
  );
};

export default NewInterViewStep1;
