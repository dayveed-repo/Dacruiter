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
  gender?: string,
  updateProfile?: boolean
) => {
  let update: { [key: string]: any } = updateProfile
    ? {
        gender,
        profileImageUrl: pictureUrl,
      }
    : {
        gender,
        profileImageUrl: pictureUrl,
        numOfCredits: 5,
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

  if (superBaseId) {
    update = {
      ...update,
      supabaseUserId: superBaseId,
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
