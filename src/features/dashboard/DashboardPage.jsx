import React, { useState, useEffect } from "react";
import { TrendingUp, BarChart3, ArrowUpRight, Loader } from "lucide-react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { fetchLivePrice } from "../../utils/marketApi";

const DashboardPage = () => {
  const [portfolioData] = useLocalStorage("portfolio_app_data", {
    Zerodha: [],
    Groww: [],
    "Angel One": [],
  });

  const [livePrices, setLivePrices] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Calculate summary statistics
  const allStocks = Object.values(portfolioData).flat();
  const totalInvestment = allStocks.reduce((sum, stock) => {
    return (
      sum +
      stock.purchases.reduce((stockSum, purchase) => {
        return stockSum + purchase.quantity * purchase.price;
      }, 0)
    );
  }, 0);

  const totalStocks = allStocks.length;

  // Calculate total current value based on live prices
  const totalCurrentValue = allStocks.reduce((sum, stock) => {
    const currentPrice = livePrices[stock.symbol] || 0;
    const quantity = stock.purchases.reduce((q, p) => q + p.quantity, 0);
    return sum + quantity * currentPrice;
  }, 0);

  // Calculate percentage change
  const percentageChange =
    totalInvestment > 0
      ? ((totalCurrentValue - totalInvestment) / totalInvestment) * 100
      : 0;

  const isPositive = percentageChange >= 0;

  // Fetch live prices on component mount and when stocks change
  useEffect(() => {
    const fetchPrices = async () => {
      setIsLoading(true);
      const uniqueAssets = allStocks.reduce((acc, stock) => {
        const exists = acc.find(
          (item) =>
            item.symbol === stock.symbol && item.exchange === stock.exchange,
        );
        if (!exists) {
          acc.push({ symbol: stock.symbol, exchange: stock.exchange });
        }
        return acc;
      }, []);

      const priceMap = { ...livePrices };
      for (const asset of uniqueAssets) {
        const price = await fetchLivePrice(asset.symbol, asset.exchange);
        if (price) {
          priceMap[asset.symbol] = price;
        }
      }
      setLivePrices(priceMap);
      setIsLoading(false);
    };

    if (allStocks.length > 0) {
      fetchPrices();
    } else {
      setIsLoading(false);
    }
  }, [allStocks.length]);

  const brokerStats = Object.entries(portfolioData).map(([broker, stocks]) => {
    const investment = stocks.reduce((sum, stock) => {
      return (
        sum +
        stock.purchases.reduce((stockSum, purchase) => {
          return stockSum + purchase.quantity * purchase.price;
        }, 0)
      );
    }, 0);

    const currentValue = stocks.reduce((sum, stock) => {
      const currentPrice = livePrices[stock.symbol] || 0;
      const quantity = stock.purchases.reduce((q, p) => q + p.quantity, 0);
      return sum + quantity * currentPrice;
    }, 0);

    const brokerPercentage =
      investment > 0 ? ((currentValue - investment) / investment) * 100 : 0;

    return {
      broker,
      count: stocks.length,
      investment,
      currentValue,
      brokerPercentage,
    };
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-black text-white mb-2">Dashboard</h1>
        <p className="text-slate-400">Welcome to your portfolio overview</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Stocks */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-brand-accent/50 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 font-semibold">Total Stocks</h3>
            <BarChart3 className="text-blue-400" size={24} />
          </div>
          <p className="text-3xl font-black text-white">{totalStocks}</p>
          <p className="text-sm text-slate-500 mt-2">Holdings</p>
        </div>

        {/* Total Investment */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-brand-accent/50 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 font-semibold">Total Invested</h3>
            <TrendingUp className="text-brand-accent" size={24} />
          </div>
          <p className="text-3xl font-black text-white">
            ₹
            {totalInvestment.toLocaleString("en-IN", {
              maximumFractionDigits: 0,
            })}
          </p>
          <p className="text-sm text-slate-500 mt-2">Cost price</p>
        </div>

        {/* Total Right Now */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-brand-accent/50 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 font-semibold">Total Right Now</h3>
            <TrendingUp className="text-emerald-400" size={24} />
          </div>
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader className="animate-spin text-brand-accent" size={20} />
              <span className="text-slate-400">Fetching live prices...</span>
            </div>
          ) : (
            <>
              <p className="text-3xl font-black text-white">
                ₹
                {totalCurrentValue.toLocaleString("en-IN", {
                  maximumFractionDigits: 0,
                })}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <p
                  className={`text-sm font-semibold ${isPositive ? "text-emerald-400" : "text-red-400"}`}
                >
                  {isPositive ? "+" : ""}
                  {percentageChange.toFixed(2)}%
                </p>
                <p className="text-sm text-slate-500">
                  {isPositive ? "Gain" : "Loss"}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Broker Breakdown */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2">
          <ArrowUpRight className="text-brand-accent" size={24} />
          Broker Breakdown
        </h2>
        <div className="space-y-4">
          {brokerStats.map((stat) => (
            <div key={stat.broker} className="p-4 bg-slate-800/50 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold text-white">{stat.broker}</p>
                  <p className="text-sm text-slate-400">{stat.count} stocks</p>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-semibold ${stat.brokerPercentage >= 0 ? "text-emerald-400" : "text-red-400"}`}
                  >
                    {stat.brokerPercentage >= 0 ? "+" : ""}
                    {stat.brokerPercentage.toFixed(2)}%
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Invested:</span>
                  <span className="text-white font-semibold">
                    ₹
                    {stat.investment.toLocaleString("en-IN", {
                      maximumFractionDigits: 0,
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Current:</span>
                  {isLoading ? (
                    <div className="flex items-center gap-1">
                      <Loader className="animate-spin text-brand-accent" size={14} />
                      <span className="text-slate-400 text-xs">Loading...</span>
                    </div>
                  ) : (
                    <span className="text-white font-semibold">
                      ₹
                      {stat.currentValue.toLocaleString("en-IN", {
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
