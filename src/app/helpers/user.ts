import { supabase } from "../config/superbase.config";

export const getDBUser = async (email: string) => {
  let { data: users, error: dbError } = await supabase
    .from("users")
    .select("*")
    .eq("email", email);

  if (dbError?.message) {
    return { error: dbError?.message };
  }

  if (!users) {
    return { error: "No user found" };
  }

  return { user: users[0] || {} };
};

export const saveDBUser = async (
  email: string,
  name: string,
  superBaseId: string,
  pictureUrl?: string,
  gender?: string
) => {
  let update: { [key: string]: any } = {
    numberOfCredits: 5,
    totalCredits: 5,
  };

  if (email) {
    update = {
      ...update,
      email,
    };
  }

  if (name) {
    update = {
      ...update,
      name,
    };
  }

  if (pictureUrl) {
    update = {
      ...update,
      profileImageUrl: pictureUrl,
    };
  }

  if (superBaseId) {
    update = {
      ...update,
      supabaseUserId: superBaseId,
    };
  }

  if (gender) {
    update = {
      ...update,
      gender,
    };
  }

  const { data, error } = await supabase
    .from("users")
    .upsert(update, { onConflict: "email" })
    .select();

  if (error?.message) {
    return { error: error?.message };
  }

  if (!data?.length) {
    return { error: "Failed to save changes" };
  }

  return { success: true };
};
