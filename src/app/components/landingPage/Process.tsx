import React from "react";
import { FaRobot, FaChartBar, FaRocket } from "react-icons/fa";

const processes = [
  {
    title: "Automate the Interview Process",
    description:
      "Skip scheduling headaches. Our platform automatically conducts structured AI-driven interviews, ensuring every candidate is assessed fairly and consistently.",
    icon: FaRobot,
  },
  {
    title: "Gain Actionable Insights",
    description:
      "Receive instant, data-driven reports on candidate skills, personality fit, and communication style—so you make informed hiring decisions without bias.",
    icon: FaChartBar,
  },
  {
    title: "Hire the Best, Faster",
    description:
      "Streamline shortlisting and move top candidates forward with confidence. Save hours of manual work while securing the right talent quickly.",
    icon: FaRocket,
  },
];

const Process = () => {
  return (
    <div
      id={"process"}
      className="pt-10 pb-[90px] w-full px-4 md:px-5 gradient-section"
      style={{
        background: "",
      }}
    >
      <div className="w-full max-w-6xl mx-auto">
        <h3 className="text-3xl text-foreground font-lato font-bold text-center">
          Simple Steps to Streamline Recruitent
        </h3>

        <div className="mt-5 grid grid-cols-3 gap-6">
          {processes.map((step) => (
            <div
              key={step.title}
              className="flex flex-col items-center space-y-4"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary">
                <step.icon className="text-xl text-white" />
              </div>

              <h4 className="text-foreground text-xl font-semibold text-center">
                {step.title}
              </h4>
              <p className="text-foreground-secondary text-sm font-medium text-center">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Process;
