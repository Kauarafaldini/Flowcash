import { ReactNode } from "react";

interface DashboardCardProps {
  label: string;
  value: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "blue" | "green" | "orange" | "red";
}

const colorStyles = {
  blue: "bg-blue-50 text-blue-900 border-blue-200",
  green: "bg-green-50 text-green-900 border-green-200",
  orange: "bg-orange-50 text-orange-900 border-orange-200",
  red: "bg-red-50 text-red-900 border-red-200",
};

const iconBgStyles = {
  blue: "bg-blue-100 text-blue-600",
  green: "bg-green-100 text-green-600",
  orange: "bg-orange-100 text-orange-600",
  red: "bg-red-100 text-red-600",
};

export default function DashboardCard({
  label,
  value,
  icon,
  trend,
  color = "blue",
}: DashboardCardProps) {
  return (
    <div className={`p-6 rounded-lg border ${colorStyles[color]}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium opacity-75 mb-2">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
          {trend && (
            <p
              className={`text-xs font-medium mt-2 ${
                trend.isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        {icon && <div className={`p-3 rounded-lg ${iconBgStyles[color]}`}>{icon}</div>}
      </div>
    </div>
  );
}
