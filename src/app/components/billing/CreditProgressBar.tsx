const CreditProgressBar = ({
  totalCredits,
  totalUsed,
}: {
  totalCredits: number;
  totalUsed: number;
}) => {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <p className="text-base text-foreground font-semibold">
          {Number(totalUsed).toLocaleString()}
        </p>
        <p className="text-base text-foreground font-semibold">
          {Number(totalCredits).toLocaleString()}
        </p>
      </div>

      <div className="h-3 w-full bg-primary/10 rounded-full">
        <div
          className="h-3 bg-primary rounded-full"
          style={{ width: `${(totalUsed / totalCredits) * 100}%` }}
        ></div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-foreground-secondary font-medium">
          Total Used Credits
        </p>
        <p className="text-sm text-foreground-secondary font-medium">
          Total Credit Limit
        </p>
      </div>
    </div>
  );
};

export default CreditProgressBar;
