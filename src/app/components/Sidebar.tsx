"use client";
import React, { useState } from "react";
import Logo from "./Logo";
import {
  FaTachometerAlt,
  FaCalendarAlt,
  FaListAlt,
  FaCreditCard,
  FaCog,
} from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "../config/superbase.config";
import toast from "react-hot-toast";
import useUser from "../hooks/getUser";
import { AiOutlineClose } from "react-icons/ai";

type SidebarItem = {
  title: string;
  path: string;
  icon: React.ReactNode;
};

const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: <FaTachometerAlt />,
  },
  // {
  //   title: "Scheduled Interviews",
  //   path: "/available-interviews",
  //   icon: <FaCalendarAlt />,
  // },
  {
    title: "My Interviews",
    path: "/interviews",
    icon: <FaListAlt />,
  },
  {
    title: "Billing",
    path: "/billing",
    icon: <FaCreditCard />,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: <FaCog />,
  },
];

const Sidebar = ({
  setOpenSidebar,
  openSidebar,
}: {
  openSidebar: boolean;
  setOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const pathname = usePathname();
  const [loading, setloading] = useState(false);
  const router = useRouter();
  const [user] = useUser();

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    setloading(true);

    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to logout");
    } else {
      router.push("/auth/login");
      toast.success("Logged out successfully");
    }
    setloading(false);
  };

  return (
    <div
      className={`max-h-full h-full bg-white md:bg-secondary/10 absolute z-20 left-0 top-0 md:relative w-[50%] md:w-[18%] px-3 py-5 ${
        openSidebar ? "flex" : "hidden md:flex"
      } flex-col`}
    >
      <div className="flex items-center justify-between">
        <Logo pathname={user.email ? "/dashboard" : "/"} />

        <AiOutlineClose
          className={`text-foreground h-[20px] w-[20px] cursor-pointer md:hidden`}
          onClick={() => setOpenSidebar(false)}
        />
      </div>

      <div className="mt-6 space-y-2">
        {sidebarItems.map((item) => (
          <a
            key={item.title}
            href={item.path}
            className={`flex items-center gap-3 py-2 px-3 rounded hover:bg-secondary/50 ${
              pathname.includes(item.path)
                ? "bg-secondary/50 text-primary"
                : "text-foreground-secondary"
            } transition-colors text-base font-medium cursor-pointer`}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.title}</span>
          </a>
        ))}
      </div>

      <button
        onClick={handleLogout}
        disabled={loading}
        style={{ opacity: loading ? 0.6 : 1 }}
        className="base-button bg-red-500 mt-auto w-full flex items-center gap-3 justify-center"
      >
        <CiLogout className="text-lg" /> {loading ? "Logging Out..." : "Logout"}{" "}
      </button>
    </div>
  );
};

export default Sidebar;
