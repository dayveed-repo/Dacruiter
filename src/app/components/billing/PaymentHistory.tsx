import { supabase } from "@/app/config/superbase.config";
import useUser from "@/app/hooks/getUser";
import { useEffect, useState } from "react";
import Spinner from "../Spinner";
import moment from "moment";

const PaymentHistory = ({ refreshHistory }: { refreshHistory?: number }) => {
  const [payments, setpayments] = useState<{ [key: string]: any }[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialized, setinitialized] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [paginationInfo, setPaginationInfo] = useState({
    total: 0,
    skip: 0,
    limit: 12,
  });
  const [user] = useUser();

  const fetchPayments = async (loadMore = false, userSupabaseId: string) => {
    if (loading || !userSupabaseId) return;
    setLoading(true);

    const skip = paginationInfo.skip;
    const limit = paginationInfo.limit;

    let query = supabase.from("payments").select("*", { count: "exact" });

    if (userSupabaseId) {
      query = query.eq("supabaseUserId", userSupabaseId);
    }

    //  if (filterData.status) {
    //    query = query.eq("status", filterData.status);
    //  }
    //  if (filterData.title) {
    //    const escapedTitle = escapeForILike(filterData.title);
    //    query = query.ilike("title", `%${escapedTitle}%`);
    //  }
    //  if (filterData.startDate) {
    //    query = query.gte("createdAt", filterData.startDate);
    //  }
    //  if (filterData.endDate) {
    //    query = query.lte("createdAt", filterData.endDate);
    //  }

    query = query.range(skip, skip + limit - 1);

    const { data, count, error } = await query;
    setinitialized(true);

    if (!error && data) {
      const finalPayments = data.map((payment) => ({
        id: payment.id,
        invoiceNumber: payment.invoiceNumber || "",
        amount: payment.amount || 0,
        status: payment.status,
        numOfCredits: payment.creditsPurchased,
        dateIssued: payment.createdAt,
      }));
      setpayments((prev) =>
        loadMore ? [...prev, ...finalPayments] : finalPayments
      );

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
      fetchPayments(true, user.supabaseUserId);
    }
  };

  useEffect(() => {
    if (user.id) {
      setPaginationInfo({
        total: 0,
        skip: 0,
        limit: 12,
      });
      fetchPayments(false, user.supabaseUserId);
    }
  }, [user.id, refreshHistory]);

  return (
    <div className="w-full max-w-[100%] overflow-x-scroll md:overflow-x-visible divide-y divide-foreground-secondary/30 relative">
      <div className="md:w-full w-max bg-[#f3f3f3] text-sm font-semibold text-foreground-secondary flex md:grid grid-cols-5 py-3 rounded-t-2xl md:pr-[14px]">
        <p className="px-2 md:min-w-0 min-w-[120px]">Invoice ID</p>
        <p className="px-2 md:min-w-0 min-w-[100px]">Amount</p>
        <p className="px-2 md:min-w-0 min-w-[120px] md:max-w-none max-w-[120px]">
          Credits Purchased
        </p>
        <p className="px-2 md:min-w-0 min-w-[100px] md:max-w-none max-w-[100px]">
          Status
        </p>
        <p className="px-2 md:min-w-0 min-w-[100px]">Date Issued</p>
      </div>

      <div
        className="w-full max-h-[40vh] md:overflow-y-scroll"
        onScroll={handleScroll}
      >
        {payments.length ? (
          <>
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="w-max md:w-full text-sm text-foreground-secondary flex md:grid grid-cols-5 py-3"
              >
                <p className="px-2 md:min-w-0 min-w-[120px]">
                  {payment.invoiceNumber}
                </p>
                <p className="px-2 md:min-w-0 min-w-[100px]">
                  $
                  {Number(payment.amount).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </p>

                <p className="px-2 md:min-w-0 min-w-[120px] md:max-w-none max-w-[120px]">
                  {payment.numOfCredits}
                </p>

                <div className="px-2 capitalize md:min-w-0 min-w-[100px] md:max-w-none max-w-[100px]">
                  <p
                    className={`${
                      payment.status === "paid"
                        ? "bg-[#10B981]/10 text-[#10B981]"
                        : payment.status === "failed"
                        ? "bg-red-500/10 text-red-500"
                        : "bg-primary/10 text-primary"
                    } px-1.5 py-[2px] rounded-sm w-max`}
                  >
                    {payment.status}
                  </p>
                </div>

                <p className="px-2 md:min-w-0 min-w-[100px]">
                  {moment(payment.dateIssued).format("DD-MM-YYYY")}
                </p>
              </div>
            ))}
          </>
        ) : initialized ? (
          <div className="w-full py-10 flex flex-col items-center justify-center">
            <p className="text-foreground-secondary text-sm">
              No payment history available.
            </p>
          </div>
        ) : (
          ""
        )}

        {loading && (
          <div className="w-full text-center text-sm">
            <span className="inline-block align-middle mr-2">
              <Spinner />
            </span>
            Fetching Payments...
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;
