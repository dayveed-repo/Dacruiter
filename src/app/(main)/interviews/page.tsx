"use client";
import InterviewLists from "@/app/components/interview/InterviewLists";
import useUser from "@/app/hooks/getUser";

const Inverviews = () => {
  const [dbUser] = useUser();

  return (
    <InterviewLists
      userSupabaseId={dbUser.supabaseUserId}
      allowViewInterview={true}
      pageDesc="Manage all interviews on your account and view details about applied candidates"
      showStatusFilter={true}
      userbased={true}
    />
  );
};

export default Inverviews;
