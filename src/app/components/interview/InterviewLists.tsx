"use client";
import { supabase } from "@/app/config/superbase.config";
import { escapeForILike } from "@/app/helpers/general";
import React, { useEffect, useState } from "react";
import Spinner from "../Spinner";
import InterviewCard from "./InterviewCard";

const InterviewLists = ({
  pageDesc,
  showStatusFilter,
  allowViewInterview,
  userSupabaseId,
  userbased,
}: {
  pageDesc: string;
  showStatusFilter: boolean;
  allowViewInterview: boolean;
  userSupabaseId?: string;
  userbased?: boolean;
}) => {
  const [filterData, setfilterData] = useState({
    startDate: "",
    endDate: "",
    title: "",
    status: "active",
    skills: "",
  });
  const [paginationInfo, setPaginationInfo] = useState({
    total: 0,
    skip: 0,
    limit: 12,
  });
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialized, setinitialized] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchInterviews = async (loadMore = false) => {
    if (loading || (userbased && !userSupabaseId)) return;
    setLoading(true);

    const skip = paginationInfo.skip;
    const limit = paginationInfo.limit;

    let query = supabase
      .from("interviews")
      .select(
        "id,title,description,duration,interviewId,numberOfQuestions,createdAt,status,userSupabaseId,interviewSessions!left(id)",
        { count: "exact" }
      );

    if (userSupabaseId) {
      query = query.eq("userSupabaseId", userSupabaseId);
    }

    if (filterData.status) {
      query = query.eq("status", filterData.status);
    }
    if (filterData.title) {
      const escapedTitle = escapeForILike(filterData.title);
      query = query.ilike("title", `%${escapedTitle}%`);
    }
    if (filterData.startDate) {
      query = query.gte("createdAt", filterData.startDate);
    }
    if (filterData.endDate) {
      query = query.lte("createdAt", filterData.endDate);
    }

    query = query.range(skip, skip + limit - 1);

    const { data, count, error } = await query;
    setinitialized(true);

    if (!error && data) {
      setInterviews((prev) => (loadMore ? [...prev, ...data] : data));

      const newSkip = loadMore ? skip + limit : skip;

      setPaginationInfo({
        ...paginationInfo,
        total: count || 0,
        skip: newSkip,
      });

      // ✅ if no more results left
      if (newSkip >= (count || 0)) {
        setHasMore(false);
      }
    } else {
      console.error("Error fetching interviews:", error);
    }

    setLoading(false);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    if (scrollTop + clientHeight >= scrollHeight - 50 && hasMore && !loading) {
      fetchInterviews(true);
    }
  };

  useEffect(() => {
    setPaginationInfo({
      total: 0,
      skip: 0,
      limit: 12,
    });
    fetchInterviews(false);
  }, [filterData, userSupabaseId]);

  return (
    <div className="py-3" onScroll={handleScroll}>
      <p className="text-sm font-medium text-foreground-secondary">
        {pageDesc}
      </p>
      <div className="flex mt-3 items-center space-x-3 bg-white px-2 py-3 rounded-lg shadow-sm">
        <div className="space-y-1">
          <p className="text-sm text-foreground-secondary">Job Title</p>
          <input
            value={filterData.title}
            onChange={(e) =>
              setfilterData({ ...filterData, title: e.target.value })
            }
            type="text"
            className="formInput"
          />
        </div>

        {showStatusFilter && (
          <div className="space-y-1">
            <p className="text-sm text-foreground-secondary">Status</p>
            <select
              className="formInput"
              value={filterData.status}
              onChange={(e) =>
                setfilterData({ ...filterData, status: e.target.value })
              }
            >
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        )}

        <div className="space-y-1">
          <p className="text-sm text-foreground-secondary">Start Date</p>
          <input
            value={filterData.startDate}
            onChange={(e) =>
              setfilterData({ ...filterData, startDate: e.target.value })
            }
            type="date"
            className="formInput"
          />
        </div>

        <div className="space-y-1">
          <p className="text-sm text-foreground-secondary">End Date</p>
          <input
            value={filterData.endDate}
            onChange={(e) =>
              setfilterData({ ...filterData, endDate: e.target.value })
            }
            type="date"
            className="formInput"
          />
        </div>
      </div>

      <div className="mt-4">
        {loading && (
          <div className="w-full text-center text-sm">
            <span className="inline-block align-middle mr-2">
              <Spinner />
            </span>
            Fetching Interviews...
          </div>
        )}

        <div className="mb-2 grid grid-cols-3 gap-4">
          {interviews.map((interview) => (
            <InterviewCard
              key={interview.id}
              status={interview.status}
              createdAt={interview.createdAt}
              title={interview.title}
              description={interview.description}
              allowViewDetails={allowViewInterview}
              duration={interview.duration}
              interviewId={interview.interviewId}
              numberOfQuestions={interview.numberOfQuestions}
              numberOfCandidates={interview?.interviewSessions?.length}
            />
          ))}
        </div>

        {!interviews.length && initialized ? (
          <p className="text-center font-medium py-4">No Results Found</p>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default InterviewLists;
