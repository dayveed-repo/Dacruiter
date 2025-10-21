"use client";
import React, { use, useState } from "react";
import Logo from "./Logo";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useUser from "../hooks/getUser";
import { BiMenu } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";

const Navbar = () => {
  const router = useRouter();
  const [user] = useUser();
  const [isOpen, setisOpen] = useState(false);

  return (
    <div className="flex items-center justify-between px-4 py-4 rounded-2xl shadow-md md:shadow-lg relative">
      <Logo />

      <div className="hidden md:flex items-center space-x-5">
        <Link
          href="/#process"
          className="text-sm text-foreground-secondary font-medium"
        >
          Our Process
        </Link>
        <Link
          href="/#about"
          className="text-sm text-foreground-secondary font-medium"
        >
          About
        </Link>
        <Link
          href="/#features"
          className="text-sm text-foreground-secondary font-medium"
        >
          Features
        </Link>

        {user.email ? (
          <button
            className="base-button min-w-[90px]"
            onClick={() => router.push("/dashboard")}
          >
            Dashboard
          </button>
        ) : (
          <button
            className="base-button min-w-[90px]"
            onClick={() => router.push("/auth/register")}
          >
            Get Started
          </button>
        )}
      </div>

      <div className="md:hidden">
        <BiMenu
          className={`text-foreground h-[20px] w-[20px] cursor-pointer ${
            isOpen ? "hidden" : "md:hidden"
          }`}
          onClick={() => setisOpen(true)}
        />
        <AiOutlineClose
          className={`text-foreground h-[20px] w-[20px] cursor-pointer ${
            isOpen ? "md:hidden" : "hidden"
          }`}
          onClick={() => setisOpen(false)}
        />
      </div>

      <div
        className={`${
          isOpen ? "flex md:hidden" : "hidden"
        } absolute top-[100%] right-0 w-full bg-white rounded-b-[20px] border border-foreground-secondary/20 flex-col space-y-3 p-4 shadow-lg`}
      >
        <Link
          href="/#process"
          onClick={() => setisOpen(false)}
          className="text-sm text-foreground-secondary font-medium"
        >
          Our Process
        </Link>

        <Link
          href="/#about"
          onClick={() => setisOpen(false)}
          className="text-sm text-foreground-secondary font-medium"
        >
          About
        </Link>

        <Link
          href="/#features"
          onClick={() => setisOpen(false)}
          className="text-sm text-foreground-secondary font-medium"
        >
          Features
        </Link>

        {user.email ? (
          <button
            className="base-button min-w-[90px]"
            onClick={() => {
              router.push("/dashboard");
              setisOpen(false);
            }}
          >
            Dashboard
          </button>
        ) : (
          <button
            className="base-button min-w-[90px]"
            onClick={() => {
              setisOpen(false);
              router.push("/auth/register");
            }}
          >
            Get Started
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
