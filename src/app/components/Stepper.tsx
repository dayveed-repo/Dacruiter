"use client";
import React from "react";

const Stepper = ({
  currentStep,
  numberOfSteps,
}: {
  currentStep: number;
  numberOfSteps: number;
}) => {
  return (
    <div className="flex items-center space-x-2">
      {Array(numberOfSteps || 2)
        .fill("")
        .map((_, index) => (
          <div
            key={index}
            style={{
              background: `${
                index + 1 <= currentStep ? `var(--color-primary)` : "#e9610066"
              }`,
            }}
            className={`h-2 w-[67px] rounded-[1.75rem]`}
          />
        ))}
    </div>
  );
};

export default Stepper;
