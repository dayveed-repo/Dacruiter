"use client";
import React, { useState } from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import Sidebar from "../components/Sidebar";

const DasboardWrapper = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [openSidebar, setopenSidebar] = useState(false);

  return (
    <>
      <Sidebar setOpenSidebar={setopenSidebar} openSidebar={openSidebar} />

      <div className="w-full md:w-[82%] flex flex-col bg-secondary/10 py-5">
        <DashboardNavbar setOpenSidebar={setopenSidebar} />
        <div className="flex-grow overflow-y-scroll mt-2 px-4">{children}</div>
      </div>
    </>
  );
};

export default DasboardWrapper;
