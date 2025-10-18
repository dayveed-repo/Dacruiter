import Image from "next/image";
import React from "react";

const About = () => {
  return (
    <div id="about" className="pt-10 pb-14 w-full px-4 md:px-5">
      <div className="w-full max-w-6xl mx-auto flex space-x-12 items-center justify-between">
        <div className="w-[55%] space-y-6">
          <h3 className="text-3xl text-foreground font-lato font-bold">
            About Us
          </h3>

          <p className="text-foreground-secondary text-base font-medium">
            We are on a mission to revolutionize the hiring process. Traditional
            recruitment often consumes endless hours with scheduling, repetitive
            interviews, and subjective evaluations, leaving recruiters and
            companies struggling to identify the best talent quickly.
            <br />
            <br /> Our platform empowers organizations to automate candidate
            interviews, analyze responses with intelligent insights, and
            streamline decision-making. By reducing time-to-hire and enhancing
            objectivity, we help recruiters focus on what matters most:
            connecting with the right talent. <br /> <br />
            We combine advanced interview automation, candidate analytics, and
            collaborative tools to give companies a smarter, more efficient
            hiring experience — while ensuring candidates feel engaged and
            fairly evaluated.
          </p>
        </div>

        <Image
          src={"/about.jpg"}
          alt={"About us"}
          height={0}
          width={0}
          unoptimized
          className="w-[40%]  h-auto"
        />
      </div>
    </div>
  );
};

export default About;
