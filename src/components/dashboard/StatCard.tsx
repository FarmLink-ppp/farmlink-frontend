
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: LucideIcon;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, trend, icon: Icon }) => {
  return (
    <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-farmlink-darkgreen/70 text-sm font-medium mb-1">{title}</p>
            <p className="text-3xl font-bold text-farmlink-darkgreen mb-2">{value}</p>
            <div className="flex items-center space-x-1">
              {trend === "up" ? (
                <TrendingUp className="h-4 w-4 text-farmlink-green" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span className={`text-sm font-medium ${
                trend === "up" ? "text-farmlink-green" : "text-red-500"
              }`}>
                {change}
              </span>
            </div>
          </div>
          <div className="w-14 h-14 bg-gradient-to-br from-farmlink-lightgreen/20 to-farmlink-mediumgreen/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
            <Icon className="h-7 w-7 text-farmlink-green" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;