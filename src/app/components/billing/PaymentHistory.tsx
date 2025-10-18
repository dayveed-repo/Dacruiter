const payments: any[] = [
  //   {
  //     id: "INV-001",
  //     amount: "$100.00",
  //     status: "paid",
  //     numOfCredits: 10,
  //     dateIssued: "2024-01-15",
  //   },
  //   {
  //     id: "INV-002",
  //     amount: "$150.00",
  //     status: "pending",
  //     numOfCredits: 10,
  //     dateIssued: "2024-02-10",
  //   },
  //   {
  //     id: "INV-003",
  //     amount: "$200.00",
  //     status: "paid",
  //     numOfCredits: 10,
  //     dateIssued: "2024-03-05",
  //   },
  //   {
  //     id: "INV-003",
  //     amount: "$200.00",
  //     status: "paid",
  //     numOfCredits: 10,
  //     dateIssued: "2024-03-05",
  //   },
  //   {
  //     id: "INV-004",
  //     amount: "$200.00",
  //     status: "failed",
  //     numOfCredits: 10,
  //     dateIssued: "2024-03-05",
  //   },
  //   {
  //     id: "INV-005",
  //     amount: "$200.00",
  //     status: "paid",
  //     numOfCredits: 10,
  //     dateIssued: "2024-03-05",
  //   },
  //   {
  //     id: "INV-006",
  //     amount: "$200.00",
  //     status: "failed",
  //     numOfCredits: 10,
  //     dateIssued: "2024-03-05",
  //   },
  //   {
  //     id: "INV-007",
  //     amount: "$200.00",
  //     status: "paid",
  //     numOfCredits: 10,
  //     dateIssued: "2024-03-05",
  //   },
  //   {
  //     id: "INV-008",
  //     amount: "$200.00",
  //     status: "paid",
  //     numOfCredits: 10,
  //     dateIssued: "2024-03-05",
  //   },
  //   {
  //     id: "INV-009",
  //     amount: "$200.00",
  //     status: "paid",
  //     numOfCredits: 10,
  //     dateIssued: "2024-03-05",
  //   },
  //   {
  //     id: "INV-010",
  //     amount: "$200.00",
  //     status: "paid",
  //     numOfCredits: 10,
  //     dateIssued: "2024-03-05",
  //   },
];

const PaymentHistory = () => {
  return (
    <div className="w-full divide-y divide-foreground-secondary/30 relative">
      <div className="w-full bg-[#f3f3f3] text-sm font-semibold text-foreground-secondary grid grid-cols-5 py-3 rounded-t-2xl pr-[14px]">
        <p className="px-2">Invoice ID</p>
        <p className="px-2">Amount</p>
        <p className="px-2">Credits Purchased</p>
        <p className="px-2">Status</p>
        <p className="px-2">Date Issued</p>
      </div>

      <div className="overflow-y-auto max-h-[40vh]">
        {payments.length ? (
          <>
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="w-full text-sm text-foreground-secondary grid grid-cols-5 py-3"
              >
                <p className="px-2">{payment.id}</p>
                <p className="px-2">{payment.amount}</p>
                <p className="px-2">{payment.numOfCredits}</p>
                <div className="px-2 capitalize">
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

                <p className="px-2">{payment.dateIssued}</p>
              </div>
            ))}
          </>
        ) : (
          <div className="w-full py-10 flex flex-col items-center justify-center">
            <p className="text-foreground-secondary text-sm">
              No payment history available.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;
