import React from "react";
import {
  Layers,
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const Card = ({ title, value, icon: Icon, colorClass, trend, isLoss }) => {
  // Determine trend color and icon based on performance
  const trendColor = isLoss ? "text-red-400" : "text-brand-accent";
  const TrendIcon = isLoss ? ArrowDownRight : ArrowUpRight;

  return (
    <div className="bg-brand-card border border-brand-border p-6 rounded-2xl flex items-center justify-between group hover:border-brand-accent/50 transition-all duration-300 shadow-lg">
      <div className="space-y-1">
        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
          {title}
        </p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-3xl font-bold text-white tracking-tight">
            {value}
          </h3>
          {trend && (
            <span
              className={`${trendColor} text-xs font-medium flex items-center gap-0.5 animate-in fade-in zoom-in duration-500`}
            >
              <TrendIcon size={14} /> {trend}
            </span>
          )}
        </div>
      </div>
      <div
        className={`p-4 rounded-2xl ${colorClass} group-hover:scale-110 transition-transform duration-300`}
      >
        <Icon size={28} />
      </div>
    </div>
  );
};

const StatsCards = ({ count, invested, value }) => {
  const formatCurrency = (num) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  const totalProfit = value - invested;
  const isLoss = totalProfit < 0;

  // Calculate percentage and ensure we don't show a double negative sign
  const absProfitPercentage =
    invested > 0 ? Math.abs((totalProfit / invested) * 100).toFixed(2) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card
        title="Stocks Count"
        value={count}
        icon={Layers}
        colorClass="bg-blue-500/10 text-blue-400"
      />

      <Card
        title="Total Invested"
        value={formatCurrency(invested)}
        icon={Wallet}
        colorClass="bg-slate-700/30 text-slate-300"
      />

      <Card
        title="Current Value"
        value={formatCurrency(value)}
        // Use TrendingDown icon and Red color if in loss
        icon={isLoss ? TrendingDown : TrendingUp}
        colorClass={
          isLoss
            ? "bg-red-500/10 text-red-400"
            : "bg-brand-accent/10 text-brand-accent"
        }
        trend={`${isLoss ? "-" : "+"}${absProfitPercentage}%`}
        isLoss={isLoss}
      />
    </div>
  );
};

export default StatsCards;
