"use client";
import CandidateList from "@/app/components/candidates/CandidateList";
import DashboardNavbar from "@/app/components/DashboardNavbar";
import Modal from "@/app/components/Modal";
import Spinner from "@/app/components/Spinner";
import { config } from "@/app/config/toast";
import { closeInterview } from "@/app/helpers/interview";
import moment from "moment";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FaUserTag } from "react-icons/fa6";
import { HiOutlineClipboardList } from "react-icons/hi";
import { IoMdShareAlt } from "react-icons/io";
import { LuCalendarClock } from "react-icons/lu";
import { MdContentCopy } from "react-icons/md";
import { TfiTimer } from "react-icons/tfi";

const ManageInterview = () => {
  const { interviewId } = useParams();
  const [interviewData, setinterviewData] = useState<null | {
    [key: string]: any;
  }>(null);
  const [loading, setloading] = useState(true);
  const [candidates, setcandidates] = useState([]);
  const [loadingInterviewCandidates, setloadingInterviewCandidates] =
    useState(true);
  const [showConfirmCloseModal, setshowConfirmCloseModal] = useState(false);
  const [closingInterview, setclosingInterview] = useState(false);

  const [paginationInfo, setPaginationInfo] = useState({
    total: 0,
    skip: 0,
    limit: 12,
  });
  const [hasMore, setHasMore] = useState(true);

  const interviewUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/interview/${interviewId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(interviewUrl);
      toast.success("Link copied to clipboard", config);
    } catch (err) {
      // Optionally, handle error
      toast.success("Failed to copy link", config);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${interviewData?.title} Interview Link`,
          url: interviewUrl,
        });
      } catch (err) {
        // Optionally, handle error
      }
    } else {
      handleCopyLink();
      // Optionally, show fallback feedback
    }
  };

  const fetchInterviewDetails = async (interviewId: string) => {
    setloading(true);
    try {
      const res = await fetch(
        `/api/get-interview?interviewId=${encodeURIComponent(interviewId)}`
      );
      const data = await res.json();
      if (data?.interview) {
        setinterviewData(data.interview);
      } else {
        toast.error("Failed to load interview information", config);
      }
    } catch (error) {
      // Optionally, handle error
      console.error("Error fetching interview details:", error);
      toast.error("Failed to load interview information", config);
    }
    setloading(false);
  };

  const fetchCandidates = async (interviewId: string, loadMore = false) => {
    setloadingInterviewCandidates(true);
    try {
      const skip = paginationInfo.skip;
      const limit = paginationInfo.limit;

      const res = await fetch(
        `/api/get-candidates?interviewId=${encodeURIComponent(
          interviewId
        )}&skip=${skip}&limit=${limit}`
      );
      const data = await res.json();
      if (data?.candidates) {
        const candidates = data.candidates;
        setcandidates((prev) =>
          loadMore ? [...prev, ...candidates] : candidates
        );

        const newSkip = loadMore ? skip + limit : skip;

        setPaginationInfo({
          ...paginationInfo,
          total: data?.totalCount || 0,
          skip: newSkip,
        });

        // ✅ if no more results left
        if (newSkip >= (data?.totalCount || 0)) {
          setHasMore(false);
        }
      } else {
        toast.error("Failed to fetch candidates", config);
      }
    } catch (error) {
      // Optionally, handle error
      console.error("Error fetching interview candidates:", error);
      toast.error("Failed to fetch candidates", config);
    }
    setloadingInterviewCandidates(false);
  };

  const closeUserInterview = async () => {
    setclosingInterview(true);
    try {
      const res = await closeInterview(
        interviewId as string,
        true,
        interviewData?.userEmail || ""
      );

      if (res?.success) {
        toast.success("Interview closed successfully", config);
        setinterviewData((prev) =>
          prev ? { ...prev, status: "closed", closedAt: new Date() } : prev
        );
        setshowConfirmCloseModal(false);
      } else {
        toast.error(res?.error || "Failed to close interview", config);
      }
    } catch (error) {
      console.error("Error closing interview:", error);
      toast.error("Failed to close interview", config);
    }
    setclosingInterview(false);
  };

  useEffect(() => {
    fetchInterviewDetails(interviewId as string);
    fetchCandidates(interviewId as string);
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    if (scrollTop + clientHeight >= scrollHeight - 50 && hasMore && !loading) {
      fetchCandidates(interviewId as string, true);
    }
  };

  return (
    <div
      className={`font-sans max-h-screen h-screen overflow-y-scroll w-full flex flex-col bg-secondary/10 py-5 relative`}
    >
      <Toaster />
      <div className="sticky top-0">
        <DashboardNavbar pageTitle="Interview Details" showLogo={true} />
      </div>

      {loading ? (
        <div className="w-full text-center text-sm py-4">
          <span className="inline-block align-middle mr-2">
            <Spinner />
          </span>
          Fetching Interview Information...
        </div>
      ) : (
        <div className="flex space-x-10 w-full px-3 py-4">
          <div className="w-[60%] space-y-8">
            <div className="w-full p-5 rounded-2xl bg-white shadow-md">
              <>
                <h3 className="text-2xl font-lato font-semibold">
                  {interviewData?.title}
                </h3>

                <p className="text-sm text-foreground-secondary mt-3">
                  {interviewData?.description}
                </p>

                <div className="mt-4 space-x-1 flex items-center">
                  <h4 className="text-md font-lato font-semibold">
                    Interview Type:
                  </h4>

                  <p className="text-sm text-foreground-secondary">
                    {interviewData?.interviewTypes?.join(", ")}
                  </p>
                </div>

                <div className="pt-4 border-t border-foreground-secondary/30 grid grid-cols-3 gap-x-6 gap-y-3 mt-4">
                  <div className="flex items-center space-x-1.5">
                    <TfiTimer className="text-foreground-secondary" />
                    <h4 className="text-xs font-medium text-foreground-secondary">
                      Duration:{" "}
                      <span className="text-semibold">
                        {interviewData?.duration} mins
                      </span>
                    </h4>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <HiOutlineClipboardList className="text-foreground-secondary" />
                    <h4 className="text-xs font-medium text-foreground-secondary">
                      Questions:{" "}
                      <span className="text-semibold">
                        {interviewData?.numberOfQuestions}
                      </span>
                    </h4>
                  </div>

                  {interviewData?.limitedApplicants ? (
                    <div className="flex items-center space-x-1.5">
                      <FaUserTag className="text-foreground-secondary" />
                      <h4 className="text-xs font-medium text-foreground-secondary">
                        Max Applicants:{" "}
                        <span className="text-semibold">
                          {interviewData?.maxNumberOfApplicants}
                        </span>
                      </h4>
                    </div>
                  ) : (
                    ""
                  )}

                  <div className="flex items-center space-x-1.5">
                    <LuCalendarClock className="text-foreground-secondary" />
                    <h4 className="text-xs font-medium text-foreground-secondary">
                      Date Created:{" "}
                      <span className="text-semibold">
                        {moment(interviewData?.createdAt).format(
                          "DD MMM, YYYY"
                        )}
                      </span>
                    </h4>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <LuCalendarClock className="text-foreground-secondary" />
                    <h4 className="text-xs font-medium text-foreground-secondary">
                      Expiration Date:{" "}
                      <span className="text-semibold">
                        {moment(interviewData?.expiresAt).format(
                          "DD MMM, YYYY"
                        )}
                      </span>
                    </h4>
                  </div>
                </div>

                {interviewData?.otherSkills?.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="text-md font-lato font-semibold">
                      Interview Skills
                    </h4>

                    <ul className="space-y-1">
                      {interviewData?.otherSkills.map((skill: string) => (
                        <li
                          key={skill}
                          className="text-sm text-foreground-secondary"
                        >
                          &bull; {skill}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex items-center mt-3">
                  <MdContentCopy
                    className="text-lg text-primary cursor-pointer mr-1"
                    onClick={handleCopyLink}
                  />

                  <Link
                    href={interviewUrl}
                    className="text-xs font-medium hover:underline text-primary max-w-[65%] truncate inline-block align-middle mr-auto"
                    target="_blank"
                    title={interviewUrl}
                  >
                    {interviewUrl}
                  </Link>

                  <button
                    onClick={handleShare}
                    className="base-button p-2 flex items-center space-x-2 rounded-lg"
                  >
                    <IoMdShareAlt className="text-xl" />
                    Share
                  </button>
                </div>
              </>
            </div>

            <div
              className="w-full p-5 rounded-2xl bg-white shadow-md max-h-[40vh]"
              onScroll={handleScroll}
            >
              <h3 className="text-xl font-lato font-semibold">
                Candidates{" "}
                <span className="text-foreground-secondary">
                  ({paginationInfo.total})
                </span>
              </h3>

              <div className="mt-4 divide-y divide-foreground-secondary/20">
                {candidates.map((candidate: { [key: string]: any }) => (
                  <CandidateList
                    key={candidate?.id}
                    sessionId={candidate.id}
                    candidateEmail={candidate?.userEmail || ""}
                    candidateName={candidate?.username || "Unknown"}
                    dateCompleted={candidate?.created_at || ""}
                    startTime={candidate?.startTime || ""}
                    endTime={candidate?.endTime || ""}
                    averageScore={candidate?.averageRating || 0}
                    isRecommended={candidate?.isRecommended || false}
                    feedback={candidate?.feedback || {}}
                  />
                ))}
              </div>

              {loadingInterviewCandidates ? (
                <div className="w-full text-center text-sm py-4">
                  <span className="inline-block align-middle mr-2">
                    <Spinner />
                  </span>
                  Fetching Candidates...
                </div>
              ) : candidates.length === 0 ? (
                <p className="text-sm text-foreground-secondary mt-3">
                  No candidates have applied for this interview yet.
                </p>
              ) : (
                <></>
              )}
            </div>
          </div>

          <div className="w-[40%] space-y-8">
            <div className="w-full p-5 rounded-2xl bg-white shadow-md flex items-center">
              <h3 className="text-lg font-semibold text-foreground">Status</h3>

              <div
                className={`${
                  interviewData?.status === "active"
                    ? "text-[#10B981] bg-[#10B981]/10"
                    : "text-foreground-secondary bg-foreground-secondary/10"
                } px-3 py-1 rounded-full text-sm font-medium capitalize ml-4`}
              >
                {interviewData?.status}
              </div>

              {interviewData?.status === "active" ? (
                <button
                  onClick={() => setshowConfirmCloseModal(true)}
                  className="base-button p-2 flex items-center space-x-2 rounded-lg ml-auto"
                >
                  Close Interview
                </button>
              ) : interviewData?.status === "closed" ? (
                <p className="text-xs font-medium text-foreground-secondary ml-auto">
                  Closed:{" "}
                  {moment(interviewData?.closedAt).format("MMM DD, YYYY")}
                </p>
              ) : (
                ""
              )}

              <Modal
                open={showConfirmCloseModal}
                title="Close Interview"
                onClose={() => setshowConfirmCloseModal(false)}
              >
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    // endInterview();
                    closeUserInterview();
                  }}
                >
                  <p className="text-foreground-secondary text-sm">
                    Are you sure you want to close this interview? This action
                    is irreversible and new candidates will no longer be able to
                    apply.
                  </p>
                  <div className="mb-6 space-y-4"></div>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      className="px-4 py-2 base-button bg-primary/15 text-primary rounded"
                      onClick={() => setshowConfirmCloseModal(false)}
                    >
                      Cancel
                    </button>

                    <button
                      onClick={closeUserInterview}
                      disabled={closingInterview}
                      type="submit"
                      className="px-4 py-2 base-button rounded"
                    >
                      {closingInterview ? "Closing..." : "Close Interview"}
                    </button>
                  </div>
                </form>
              </Modal>
            </div>

            <div className="w-full p-5 rounded-2xl bg-white shadow-md">
              <h3 className="text-lg font-semibold text-foreground">
                Interview Questions
              </h3>

              <div>
                {interviewData?.questions?.map(
                  (item: { question: string; type: string }, index: number) => (
                    <div key={index} className="space-y-1.5 py-2">
                      <p className="text-sm font-medium">
                        {index + 1}. {item?.question}
                      </p>
                      <div className="flex space-x-5 justify-between items-center">
                        <p className="text-sm text-foreground-secondary">
                          Type:{" "}
                          <span className="text-primary-blue">
                            {item?.type || ""}
                          </span>
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageInterview;
