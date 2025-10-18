import { supabase } from "@/app/config/superbase.config";
import useUser from "@/app/hooks/getUser";
import moment from "moment";
import { tree } from "next/dist/build/templates/app-page";
import React, { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Spinner from "../Spinner";

const Chart = () => {
  const [highestNumber, sethighestNumber] = useState(100);

  const [user] = useUser();
  const [fetchingData, setfetchingData] = useState(true);
  const [chartData, setchartData] = useState<{ name: string; amt: number }[]>([
    { name: "", amt: 0 },
    { name: "Jan", amt: 0 },
    { name: "Feb", amt: 0 },
    { name: "Mar", amt: 0 },
    { name: "Apr", amt: 0 },
    { name: "May", amt: 0 },
    { name: "Jun", amt: 0 },
    { name: "Jul", amt: 0 },
    { name: "Aug", amt: 0 },
    { name: "Sep", amt: 0 },
    { name: "Oct", amt: 0 },
    { name: "Nov", amt: 0 },
    { name: "Dec", amt: 0 },
  ]);

  const fetchDashboardData = async () => {
    // fetch dashboard data from api

    setfetchingData(true);
    const { data: user_interviews_in_current_year } = await supabase.rpc(
      "count_user_interviews_by_month",
      {
        supabase_user_id: user.supabaseUserId,
        year_input: Number(moment().format("YYYY")),
      }
    );

    if (
      user_interviews_in_current_year &&
      user_interviews_in_current_year?.length
    ) {
      let charts: { name: string; amt: number }[] = chartData;
      user_interviews_in_current_year.forEach((item: any) => {
        if (item.month) {
          let month = moment(`${item.month || ""}-01`).format("MMM");

          charts = charts.map((chart) => {
            if (chart.name === month) {
              return {
                ...chart,
                amt: item.total_interviews || 0,
              };
            } else return chart;
          });
        }
      });

      const currentHightest = charts.reduce(
        (max, obj) => (obj.amt > max ? obj.amt : max),
        0 // Find the highest amount in the current chart data
      );

      setchartData(charts);
      sethighestNumber(currentHightest);
    }

    setfetchingData(false);
  };

  useEffect(() => {
    if (user.id) {
      fetchDashboardData();
    }
  }, [user.id]);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h4 className="text-lg font-semibold mb-4 text-foreground">
        Interviews In The Current Year
      </h4>

      {fetchingData ? (
        <div className="w-full text-center p-3 text-sm text-foreground/60">
          <span className="inline-block align-middle mr-2">
            <Spinner />
          </span>
          Fetching Chart Data
        </div>
      ) : (
        <ResponsiveContainer width={"100%"} height={250}>
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="2 2" />
            <XAxis dataKey="name" fontSize="12px" />
            <YAxis
              domain={[0, `dataMax+${highestNumber}`]}
              padding={{ top: 20 }}
              // hide
            />
            {/* <Tooltip content={<CustomTooltip nonCurrency={true} />} /> */}
            <Tooltip />
            <Area
              type="monotone"
              dataKey="amt"
              stroke="var(--primary)"
              strokeWidth="1.5"
              fill="var(--secondary)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default Chart;
