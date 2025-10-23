"use client";
import Chart from "@/app/components/dashboard/Chart";
import DashboardCard from "@/app/components/dashboard/DashboardCard";
import Spinner from "@/app/components/Spinner";
import { supabase } from "@/app/config/superbase.config";
import useUser from "@/app/hooks/getUser";
import { dashboard } from "@elevenlabs/elevenlabs-js/api/resources/conversationalAi";
import moment from "moment";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  FaCalendarCheck,
  FaPlayCircle,
  FaCheckCircle,
  FaUserCheck,
  FaThumbsUp,
  FaCoins,
} from "react-icons/fa";

const Dashboard = () => {
  const [user] = useUser();
  const router = useRouter();
  const [fetchingData, setfetchingData] = useState(true);
  const [dashboardData, setdashbardData] = useState([
    {
      title: "Total Interviews",
      value: 0,
      icon: <FaCalendarCheck className="w-6 h-6 text-primary" />,
    },
    {
      title: "Total Active Interviews",
      value: 0,
      icon: <FaPlayCircle className="w-6 h-6 text-primary" />,
    },
    {
      title: "Total Closed Interviews",
      value: 0,
      icon: <FaCheckCircle className="w-6 h-6 text-primary" />,
    },
    {
      title: "Total Screened Candidates",
      value: 0,
      icon: <FaUserCheck className="w-6 h-6 text-primary" />,
    },
    {
      title: "Total Passed Candidates",
      value: 0,
      icon: <FaThumbsUp className="w-6 h-6 text-primary" />,
    },
    {
      title: "Total Available Credits",
      value: 0,
      icon: <FaCoins className="w-6 h-6 text-primary" />,
    },
  ]);

  const fetchDashboardData = async () => {
    // fetch dashboard data from api

    setfetchingData(true);
    const { data: user_interview_sessions } = await supabase.rpc(
      "get_user_candidate_totals",
      {
        user_supabase_id: user.supabaseUserId,
      }
    );

    const { data: user_interviews_by_status } = await supabase.rpc(
      "get_interview_counts_by_status_v2",
      {
        user_supabase_id: user.supabaseUserId,
      }
    );

    let currentDashboard = dashboardData;

    currentDashboard = currentDashboard.map((total) => {
      if (total.title === "Total Available Credits") {
        return {
          ...total,
          value: user.numOfCredits,
        };
      } else {
        return total;
      }
    });

    if (user_interviews_by_status && user_interviews_by_status[0]) {
      let statusData = user_interviews_by_status[0];
      currentDashboard = currentDashboard.map((total) => {
        if (total.title === "Total Interviews") {
          return {
            ...total,
            value: statusData?.total,
          };
        } else if (total.title === "Total Active Interviews") {
          return {
            ...total,
            value: statusData.active,
          };
        } else if (total.title === "Total Closed Interviews") {
          return {
            ...total,
            value: statusData.closed,
          };
        } else {
          return total;
        }
      });
    }

    if (user_interview_sessions && user_interview_sessions[0]) {
      let sessionsData = user_interview_sessions[0];
      currentDashboard = currentDashboard.map((total) => {
        if (total.title === "Total Screened Candidates") {
          return {
            ...total,
            value: sessionsData?.total_sessions,
          };
        } else if (total.title === "Total Passed Candidates") {
          return {
            ...total,
            value: sessionsData?.passed_sessions,
          };
        } else {
          return total;
        }
      });
    }

    setdashbardData(currentDashboard);
    setfetchingData(false);
  };

  useEffect(() => {
    if (user.id) {
      fetchDashboardData();
    }
  }, [user.id]);

  return (
    <div className="py-3">
      <div className="flex md:flex-row flex-col md:items-center justify-between md:space-y-0 space-y-5">
        <h4 className="text-base font-semibold text-foreground">
          Welcome back, {user.name}
        </h4>

        <button
          className="base-button ml-auto"
          onClick={() => {
            router.push("/create-interview");
          }}
        >
          Scheduled New Interview
        </button>
      </div>
      {fetchingData ? (
        <div className="w-full text-center rounded-2xl  p-3 text-sm text-foreground/60 min-h-[30vh] flex  items-center justify-center">
          <span className="inline-block align-middle mr-2">
            <Spinner />
          </span>
          Fetching Dashbaord Information
        </div>
      ) : (
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {dashboardData.map((data) => (
            <DashboardCard
              key={data.title}
              title={data.title}
              value={data.value.toString()}
              icon={data.icon}
            />
          ))}
        </div>
      )}

      <Chart />
    </div>
  );
};

export default Dashboard;
