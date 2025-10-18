import { supabase } from "../config/superbase.config";

export const closeInterview = async (
  interviewId: string,
  requiresUserAuth: boolean,
  currentUserEmail: string
) => {
  // Logic to close the interview
  if (!interviewId) {
    return { error: "Interview ID is required" };
  }

  if (requiresUserAuth && !currentUserEmail) {
    return { error: "User Identifier is required" };
  }

  const { data, error } = await supabase
    .from("interviews")
    .select("status,id,userEmail")
    .eq("interviewId", interviewId)
    .eq("userEmail", currentUserEmail)
    .single();

  if (error) {
    console.error("Error fetching interview while closing:", error);
    return { error: "Not authorized to close interview" };
  }

  if (data?.status !== "active") {
    return { error: "Interview is no longer active" };
  }

  const { data: updateData, error: updateError } = await supabase
    .from("interviews")
    .update({ status: "closed", updatedAt: new Date(), closedAt: new Date() })
    .eq("interviewId", interviewId)
    .eq("userEmail", currentUserEmail)
    .select("*")
    .single();

  if (updateError) {
    console.error("Error closing interview:", updateError);
    return { error: "Failed to close interview" };
  }

  return { success: true, data: updateData };
};
