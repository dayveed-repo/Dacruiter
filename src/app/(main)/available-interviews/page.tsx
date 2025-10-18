import InterviewLists from "@/app/components/interview/InterviewLists";

const AvailableInterviews = () => {
  return (
    <InterviewLists
      allowViewInterview={false}
      pageDesc="Explore all interviews scheduled by recruiters"
      showStatusFilter={false}
    />
  );
};

export default AvailableInterviews;
