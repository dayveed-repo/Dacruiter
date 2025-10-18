"use client";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import useUser from "../hooks/getUser";
import Image from "next/image";
import { MdArrowBack } from "react-icons/md";
import Logo from "./Logo";

const DashboardNavbar = ({
  pageTitle,
  allowBack,
  showLogo,
}: {
  pageTitle?: string;
  allowBack?: boolean;
  showLogo?: boolean;
}) => {
  const [title, settitle] = useState(pageTitle || "");
  const pathname = usePathname();

  const [dbUser] = useUser();
  const router = useRouter();

  const generateTitle = () => {
    if (pathname === "/dashboard") {
      settitle("Dashboard");
    } else if (pathname === "/available-interviews") {
      settitle("Interviews");
    } else if (pathname === "/create-interview") {
      settitle("New Interview");
    } else if (pathname === "/interviews") {
      settitle("Interviews");
    } else if (pathname === "/billing") {
      settitle("Billing");
    } else if (pathname === "/settings") {
      settitle("Settings");
    }
  };

  const goBack = () => {
    router.back();
  };

  useEffect(() => {
    generateTitle();
  }, [pathname]);

  return (
    <div className="px-3 w-full">
      <div className="w-full py-3 px-4 flex items-center justify-between bg-white rounded-2xl shadow-sm">
        <div className="flex items-center">
          {allowBack && (
            <MdArrowBack
              className="text-foreground text-xl cursor-pointer mr-2"
              onClick={goBack}
            />
          )}

          {showLogo && (
            <div className="mr-7">
              <Logo pathname="/dashboard" />
            </div>
          )}

          <h2 className="text-primary-blue font-semibold font-lato text-3xl">
            {title}
          </h2>
        </div>

        <div className="flex space-x-3 items-center">
          {dbUser.profileImage ? (
            <Image
              src={dbUser.profileImage || ""}
              alt={dbUser.name}
              height={0}
              width={0}
              unoptimized
              priority
              className="w-[40px] h-[40px] object-cover rounded-full"
            />
          ) : (
            ""
          )}

          <h4 className="text-foreground-secondary font-medium text-base">
            {dbUser.name}
          </h4>
        </div>
      </div>
    </div>
  );
};

export default DashboardNavbar;
