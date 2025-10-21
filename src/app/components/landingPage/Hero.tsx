"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const Hero = () => {
  const router = useRouter();
  return (
    <div className="py-12 md:py-20 w-full px-4 md:px-5">
      <div className="w-full max-w-6xl mx-auto md:flex  md:items-center md:space-x-12 justify-between">
        <div className=" md:max-w-[600px]">
          <h2 className="text-3xl md:text-5xl font-lato font-bold text-foreground">
            Smarter Interviews. Faster Hires
          </h2>

          <p className="text-sm md:text-base font-medium text-foreground-secondary mt-3">
            An AI-powered recruitment platform that automates interviews,
            delivers actionable insights, and helps you find top talent in less
            time.
          </p>

          <button
            onClick={() => router.push("/auth/register")}
            className="base-button min-w-[120px] mt-8"
          >
            Get Started
          </button>
        </div>

        <Image
          src={"/hero.jpg"}
          alt={"hero"}
          height={0}
          width={0}
          unoptimized
          className="w-[48%] h-auto rounded-md hidden md:block"
        />
      </div>
    </div>
  );
};

export default Hero;
