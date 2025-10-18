import About from "./components/landingPage/About";
import Features from "./components/landingPage/Features";
import Hero from "./components/landingPage/Hero";
import Process from "./components/landingPage/Process";
import Logo from "./components/Logo";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <div className="font-sans w-full min-h-screen pt-5">
      <div className="w-full max-w-6xl mx-auto">
        <Navbar />
      </div>

      <Hero />
      <Process />
      <About />
      <Features />

      <div className="w-full bg-primary flex flex-col items-center space-y-4 px-4 py-12">
        <h2 className="text-white font-lato text-3xl font-bold">
          Ready to Elevant your Recruitment Process
        </h2>
        <p className="text-white/60 text-base font-medium">
          Join the many recruiters utilizing the plaform
        </p>
        <button className="base-button bg-white text-primary">
          Get Started
        </button>
      </div>

      <div className="w-full py-3 px-4 md:px-5 bg-primary-blue">
        <div className="w-full max-w-6xl mx-auto flex justify-between items-center">
          <Logo />

          <p className="text-white/40">2025 &copy; Danq. All rights reserved</p>
        </div>
      </div>
    </div>
  );
}
