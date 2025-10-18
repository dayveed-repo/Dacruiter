import React from "react";
import { TfiTimer } from "react-icons/tfi";
import { HiOutlineClipboardList } from "react-icons/hi";
import { LuCalendarClock } from "react-icons/lu";
import { IoMdShareAlt } from "react-icons/io";
import moment from "moment";
import toast, { Toaster } from "react-hot-toast";
import { MdContentCopy } from "react-icons/md";
import { config } from "@/app/config/toast";

const InterviewLink = ({
  title,
  duration,
  numOfQuestions,
  expDate,
  interviewId,
}: {
  title: string;
  duration: string;
  numOfQuestions: number;
  expDate: string;
  interviewId: string;
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
    <div className="mt-10">
      <Toaster />
      <h3>Interview Link</h3>

      <div className="mt-2 flex space-x-2 items-center pb-3 border-b border-foreground-secondary/30">
        <p className="p-2 bg-primary/15 rounded-xl text-xs text-primary-blue">
          {interviewUrl}
        </p>

        <MdContentCopy
          className="text-lg text-primary cursor-pointer mr-auto ml-2"
          onClick={handleCopyLink}
        />

        <button
          onClick={handleShare}
          className="base-button p-2 flex items-center space-x-2 rounded-lg"
        >
          <IoMdShareAlt className="text-xl" />
          Share
        </button>
      </div>

      <div className="flex items-center space-x-4 mt-5">
        <div className="flex items-center space-x-1.5">
          <TfiTimer className="text-foreground-secondary" />
          <h4 className="text-xs font-medium text-foreground-secondary">
            Duration: <span className="text-semibold">{duration} mins</span>
          </h4>
        </div>

        <div className="flex items-center space-x-1.5">
          <HiOutlineClipboardList className="text-foreground-secondary" />
          <h4 className="text-xs font-medium text-foreground-secondary">
            Questions: <span className="text-semibold">{numOfQuestions}</span>
          </h4>
        </div>

        <div className="flex items-center space-x-1.5">
          <LuCalendarClock className="text-foreground-secondary" />
          <h4 className="text-xs font-medium text-foreground-secondary">
            Expiration Date:{" "}
            <span className="text-semibold">
              {moment(expDate).format("DD MMM, YYYY")}
            </span>
          </h4>
        </div>
      </div>
    </div>
  );
};

export default InterviewLink;
