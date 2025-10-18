"use client";
import { supabase } from "@/app/config/superbase.config";
import { getDBUser } from "@/app/helpers/user";
import { TbMoodSadDizzy } from "react-icons/tb";
import { BiLoaderAlt } from "react-icons/bi";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Callback = () => {
  const [loading, setloading] = useState(true);
  const [error, seterror] = useState("");
  const router = useRouter();

  const getUser = async () => {
    seterror("");
    setloading(true);
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error?.message) {
        seterror(error?.message);
      }

      const dbUser = await getDBUser(user?.email || "");

      if (dbUser?.error) {
        seterror(dbUser.error);
      }

      if (dbUser?.user) {
        if (dbUser.user?.id) {
          router.push("/dashboard");
        } else {
          router.push("/auth/profile");
        }
      }
    } catch (error) {
      console.log(error);
      seterror("Failed to retrieve user information.");
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  if (error) {
    return (
      <div className="w-full h-[350px] flex flex-col justify-center items-center space-y-4 text-red-500">
        <TbMoodSadDizzy className="text-3xl" />
        <p className="text-lg  font-medium">
          Failed to retrieve user information
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-[350px] flex flex-col justify-center items-center space-y-4 text-foreground-secondary">
      <BiLoaderAlt className="text-3xl animate-spin" />
      <p className="text-lg  font-medium">Processing Information</p>
    </div>
  );
};

export default Callback;
