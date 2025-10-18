"use client";
import React, { use } from "react";
import Logo from "./Logo";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useUser from "../hooks/getUser";

const Navbar = () => {
  const router = useRouter();
  const [user] = useUser();

  return (
    <div className="flex items-center justify-between px-4 py-4 rounded-2xl shadow-lg">
      <Logo />

      <div className="flex items-center space-x-5">
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
    </div>
  );
};

export default Navbar;
