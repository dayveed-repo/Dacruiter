import React from "react";
import {
  FaCalendarAlt,
  FaRobot,
  FaChartBar,
  FaQuestionCircle,
  FaUsers,
  FaBalanceScale,
} from "react-icons/fa";

const features = [
  {
    title: "Automated Interview Scheduling",
    icon: FaCalendarAlt,
    description:
      "Eliminate back-and-forth emails by letting the platform automatically schedule interviews based on recruiter and candidate availability.",
  },
  {
    title: "AI-Powered Candidate Screening",
    icon: FaRobot,
    description:
      "Quickly identify top talent with smart pre-screening that analyzes skills, experience, and cultural fit before the interview stage.",
  },
  {
    title: "Smart Interview Insights",
    icon: FaChartBar,
    description:
      "Get detailed analytics on candidate responses, communication style, and overall performance to make data-backed hiring decisions.",
  },
  {
    title: "Customizable Question Bank",
    icon: FaQuestionCircle,
    description:
      "Build and reuse structured interview questions tailored to job roles, ensuring fair and consistent evaluation across candidates.",
  },
  {
    title: "Collaboration & Feedback Hub",
    icon: FaUsers,
    description:
      "Recruiters and hiring managers can collaborate in one place, leaving feedback, ratings, and notes on candidates instantly.",
  },
  {
    title: "Bias-Free Hiring Support",
    icon: FaBalanceScale,
    description:
      "Reduce unconscious bias with AI-driven scoring models that focus on skills and competencies, not personal identifiers.",
  },
];

const Features = () => {
  return (
    <div id="features" className="pt-[65px] pb-[80px] w-full px-4 md:px-5">
      <div className="w-full max-w-6xl mx-auto">
        <h3 className="text-3xl text-foreground font-lato font-bold">
          Powerful Features
        </h3>

        <div className="mt-5 grid grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl p-5 bg-[#f9f9f9] shadow-sm"
            >
              <feature.icon className="text-primary text-xl" />

              <div className="mt-6 space-y-4">
                <h4 className="text-foreground text-lg font-semibold">
                  {feature.title}
                </h4>
                <p className="text-sm text-foreground-secondary font-medium">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
