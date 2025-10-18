"use client";

import { useEffect, useState } from "react";
import { supabase } from "../config/superbase.config";
import { getDBUser } from "../helpers/user";

type User = {
  supabaseUserId: string;
  id: string;
  numOfCredits: number;
  totalCredits: number;
  email: string;
  name: string;
  profileImage: string;
};

const useUser = () => {
  const [dbUser, setdbUser] = useState<User>({
    email: "",
    id: "",
    name: "",
    numOfCredits: 0,
    totalCredits: 0,
    profileImage: "",
    supabaseUserId: "",
  });

  const getUser = async () => {
    const { error, data: user } = await supabase.auth.getUser();

    if (error?.name) {
      return;
    }

    const dbUser = await getDBUser(user?.user?.email || "");

    if (dbUser.user) {
      setdbUser({
        email: dbUser?.user?.email || "",
        id: dbUser?.user?.id || "",
        name: dbUser?.user?.name || "",
        numOfCredits: dbUser?.user?.numOfCredits || 0,
        totalCredits: dbUser?.user?.totalCredits || 0,
        profileImage: dbUser?.user?.profileImageUrl || "",
        supabaseUserId: dbUser?.user?.supabaseUserId || "",
      });
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return [dbUser];
};

export default useUser;
