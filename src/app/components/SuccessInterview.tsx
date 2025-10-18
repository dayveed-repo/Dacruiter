"use client";
import Lottie from "lottie-react";
import React from "react";
import loaderAnimaton from "../success-ui.json";

const SuccessInterview = () => {
  return (
    <div className="h-[200px] w-[200px] flex items-center justify-center relative">
      <Lottie
        animationData={loaderAnimaton}
        style={{ scale: 1 }}
        loop={false}
      />
    </div>
  );
};

export default SuccessInterview;
