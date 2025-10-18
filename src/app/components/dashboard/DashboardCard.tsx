import React from "react";
import { IconType } from "react-icons";

const DashboardCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) => {
  return (
    <div className="w-full bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center">
        <div className="p-3 bg-secondary/20 rounded-full text-primary">
          {icon}
        </div>

        <div className="ml-4">
          <p className="text-sm text-foreground-secondary">{title}</p>
          <p className="text-2xl font-semibold text-foreground">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
