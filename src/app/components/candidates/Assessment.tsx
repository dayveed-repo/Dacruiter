const Assessment = ({ title, score }: { title: string; score: number }) => {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <p className="text-sm text-foreground">{title}</p>

        <p className="text-sm font-medium text-primary">{score}/10</p>
      </div>

      <div className="h-2 w-full bg-primary/10 rounded-full">
        <div
          className="h-2 bg-primary rounded-full"
          style={{ width: `${(score / 10) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Assessment;
