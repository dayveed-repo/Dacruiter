"use client";
import { use, useEffect, useState } from "react";
import Logo from "../../components/Logo";
import Spinner from "@/app/components/Spinner";
import { TfiTimer } from "react-icons/tfi";
import { HiOutlineClipboardList } from "react-icons/hi";
import { LuCalendarClock } from "react-icons/lu";
import moment from "moment";
import { useParams, useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { config } from "@/app/config/toast";

const Interview = () => {
  const [interviewData, setinterviewData] = useState<null | {
    [key: string]: any;
  }>(null);
  const [loading, setloading] = useState(false);
  const { interviewId } = useParams();
  const router = useRouter();
  const [userData, setuserData] = useState({
    username: "",
    email: "",
  });
  const [issues, setIssues] = useState<string[]>([]);
  const [validating, setvalidating] = useState(false);

  const fetchInterviewDetails = async (interviewId: string) => {
    setloading(true);
    try {
      const res = await fetch(
        `/api/get-interview?interviewId=${encodeURIComponent(interviewId)}`
      );
      const data = await res.json();
      if (data?.interview) {
        setinterviewData(data.interview);
        let issues = [];
        if (
          data.interview?.maxNumberOfApplicants &&
          data.sessionsCount >= data.interview?.maxNumberOfApplicants
        ) {
          issues.push("Interview participant limit exceeded");
        }

        if (data.interview?.status !== "active") {
          issues.push("Interview is no longer active");
        }

        setIssues(issues);
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

  const joinInterview = async () => {
    if (!interviewData?.id || issues.length)
      return toast.error(
        "Unable to join interview, reload and try again",
        config
      );

    setvalidating(true);

    try {
      const response = await fetch("/api/validate-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interviewId,
          userEmail: userData.email,
        }),
      });

      const responseData = await response.json();

      if (responseData.valid) {
        sessionStorage.setItem(
          "decruiter_interview_applicant",
          JSON.stringify(userData)
        );
        router.push(`/interview/${interviewData?.interviewId}/start`);
      } else {
        toast.error(
          responseData.error || "An error ocurred while joining interview",
          config
        );
        setvalidating(false);
      }
    } catch (error) {
      console.log("Failed to join interview: ", error);
      toast.error("Failed to join interview", config);
      setvalidating(false);
    }
  };

  useEffect(() => {
    fetchInterviewDetails(interviewId as string);
  }, []);

  return (
    <main className="w-full h-screen bg-secondary/10 flex flex-col font-sans pt-10">
      <Toaster />
      <div
        className="w-[90%] max-w-3xl mx-auto p-5 rounded-2xl
        bg-white shadow-md"
      >
        <Logo />

        <p className="text-sm text-foreground-secondary mt-1.5">
          Join the interview to apply for the job/role
        </p>

        <div className="mt-8">
          {loading ? (
            <div className="w-full text-center text-sm">
              <span className="inline-block align-middle mr-2">
                <Spinner />
              </span>
              Fetching Interview Information...
            </div>
          ) : (
            <>
              <h3 className="text-xl font-lato font-semibold">
                {interviewData?.title}
              </h3>

              <p className="text-sm text-foreground-secondary mt-3">
                {interviewData?.description}
              </p>

              <div className="pt-4 border-t border-foreground-secondary/30 flex space-x-6 mt-4">
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

                <div className="flex items-center space-x-1.5">
                  <LuCalendarClock className="text-foreground-secondary" />
                  <h4 className="text-xs font-medium text-foreground-secondary">
                    Expiration Date:{" "}
                    <span className="text-semibold">
                      {moment(interviewData?.expiresAt).format("DD MMM, YYYY")}
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

              {issues.length ? (
                <div className="w-full mt-6 text-center rounded-2xl p-3 border border-primary text-sm text-primary bg-primary/15">
                  {issues.map((iss) => (
                    <p>&bull; {iss}</p>
                  ))}
                </div>
              ) : (
                <div className="space-y-2 mt-6">
                  <h4 className="text-lg font-lato font-semibold">Join</h4>

                  <div className="flex items-end space-x-5">
                    <div className="flex space-x-4 flex-grow">
                      <div className="space-y-1 w-[50%]">
                        <p className="text-sm text-foreground-secondary">
                          Enter Name
                        </p>
                        <input
                          value={userData.username}
                          onChange={(e) =>
                            setuserData({
                              ...userData,
                              username: e.target.value,
                            })
                          }
                          type="text"
                          className="formInput"
                        />
                      </div>

                      <div className="space-y-1 w-[50%]">
                        <p className="text-sm text-foreground-secondary">
                          Enter Email
                        </p>
                        <input
                          value={userData.email}
                          onChange={(e) =>
                            setuserData({ ...userData, email: e.target.value })
                          }
                          type="text"
                          className="formInput"
                        />
                      </div>
                    </div>

                    <button
                      disabled={
                        !userData.username || !userData.email || validating
                      }
                      className={`${
                        !userData.email ||
                        !userData.username ||
                        !interviewData?.id
                          ? "opacity-30"
                          : ""
                      } base-button rounded-lg py-2 min-w-[120px]`}
                      onClick={joinInterview}
                    >
                      {validating ? "Joining..." : "Join"}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default Interview;
