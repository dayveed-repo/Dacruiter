import { config } from "@/app/config/toast";
import moment from "moment";
import Link from "next/link";
import React from "react";
import toast from "react-hot-toast";
import { FaUser } from "react-icons/fa6";
import { HiOutlineClipboardList } from "react-icons/hi";
import { IoMdShareAlt } from "react-icons/io";
import { MdArrowForward, MdContentCopy } from "react-icons/md";
import { TfiTimer } from "react-icons/tfi";

const InterviewCard = ({
  title,
  description,
  duration,
  createdAt,
  status,
  interviewId,
  numberOfQuestions,
  allowViewDetails,
  numberOfCandidates,
}: {
  title: string;
  description: string;
  status: string;
  duration: string;
  createdAt: string;
  interviewId: string;
  numberOfQuestions: number;
  allowViewDetails?: boolean;
  numberOfCandidates?: number;
}) => {
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
          title: `${title} Interview Link`,
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

  return (
    <div className="bg-white shadow-sm rounded-lg p-4">
      <h4 className="text-xl font-lato font-semibold">{title}</h4>

      <div className="flex items-center justify-between mt-2">
        <p className="text-sm text-foreground-secondary">
          {moment(createdAt).format("DD MMM, YYYY")}
        </p>

        <div
          className={`${
            status === "active"
              ? "text-[#10B981] bg-[#10B981]/10"
              : "text-foreground-secondary bg-foreground-secondary/10"
          } px-3 py-1 rounded-full text-xs font-medium capitalize ml-4`}
        >
          {status}
        </div>
      </div>

      <p className="text-sm text-foreground-secondary mt-3 min-h-[70px]">
        {description.length > 100
          ? description.slice(0, 100) + "..."
          : description}
      </p>

      <div className="flex items-center mt-2 space-x-3">
        <div className="flex items-center space-x-1.5">
          <TfiTimer className="text-foreground-secondary" />
          <h4 className="text-xs font-medium text-foreground-secondary">
            Duration: <span className="text-semibold">{duration} mins</span>
          </h4>
        </div>

        <div className="flex items-center space-x-1.5">
          <HiOutlineClipboardList className="text-foreground-secondary" />
          <h4 className="text-xs font-medium text-foreground-secondary">
            Questions:{" "}
            <span className="text-semibold">{numberOfQuestions}</span>
          </h4>
        </div>

        {allowViewDetails && (
          <div className="flex items-center space-x-1.5">
            <FaUser className="text-foreground-secondary" />
            <h4 className="text-xs font-medium text-foreground-secondary">
              <span className="text-semibold">{numberOfCandidates}</span>
            </h4>
          </div>
        )}
      </div>

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

      {allowViewDetails && (
        <Link
          href={`/manage-interview/${interviewId}`}
          target="_blank"
          className="base-outline w-full mt-4 p-2 flex items-center justify-center space-x-2 rounded-lg"
        >
          View
          <MdArrowForward className="text-xl" />
        </Link>
      )}
    </div>
  );
};

export default InterviewCard;
