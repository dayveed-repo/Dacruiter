import Logo from "@/app/components/Logo";
import SuccessInterview from "@/app/components/SuccessInterview";
import React from "react";

const CompletedInterview = () => {
  return (
    <main className="w-full bg-secondary/10 h-screen flex flex-col pt-10 font-sans">
      <div className="w-[90%] mx-auto max-w-4xl flex flex-col items-center">
        <Logo />

        <h3 className="text-2xl font-bold font-lato mt-3">
          Interview Completed
        </h3>

        <SuccessInterview />

        <p className="text-foreground-secondary text-sm max-w-[400px] text-center">
          Thanks for participating in this interview. The recruiter would review
          your application and contact you shortly
        </p>
      </div>
    </main>
  );
};

export default CompletedInterview;
