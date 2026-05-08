import React, { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Edit2,
  Trash2,
  Tag,
  Calendar,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const PortfolioTable = ({
  data,
  livePrices,
  onEditPurchase,
  onDeleteStock,
  onDeletePurchase,
}) => {
  const [expandedRows, setExpandedRows] = useState(new Set());

  const toggleRow = (id) => {
    const newRows = new Set(expandedRows);
    if (newRows.has(id)) newRows.delete(id);
    else newRows.add(id);
    setExpandedRows(newRows);
  };

  return (
    <div className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead className="bg-slate-900/80 text-slate-400 text-[10px] uppercase tracking-widest border-b border-brand-border">
            <tr>
              <th className="p-4 w-12 text-center">#</th>
              <th className="p-4">Asset Details</th>
              <th className="p-4 text-right">Total Qty</th>
              <th className="p-4 text-right">Avg. Price</th>
              <th className="p-4 text-right bg-slate-800/30">
                Current Price
              </th>{" "}
              {/* NEW COLUMN HEADER */}
              <th className="p-4 text-right">Invested Value</th>
              <th className="p-4 text-right">Market Value</th>
              <th className="p-4 text-center w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border/50">
            {data.map((stock) => {
              const isExpanded = expandedRows.has(stock.id);
              // const hasMultiple = stock.purchases.length >= 1;

              // 1. Core Calculations
              const totalQty = stock.purchases.reduce(
                (sum, p) => sum + Number(p.quantity),
                0,
              );
              const totalInvested = stock.purchases.reduce(
                (sum, p) => sum + p.quantity * p.price,
                0,
              );
              const avgPrice =
                totalQty > 0 ? (totalInvested / totalQty).toFixed(2) : 0;

              // 2. Live Market Logic
              const ltp = livePrices?.[stock.symbol];
              const currentValue = ltp ? totalQty * ltp : totalInvested;
              const isProfit = ltp ? ltp >= avgPrice : true;
              const pnl = currentValue - totalInvested;
              const pnlPercent =
                totalInvested > 0
                  ? ((pnl / totalInvested) * 100).toFixed(2)
                  : 0;

              return (
                <React.Fragment key={stock.id}>
                  {/* --- PARENT ROW --- */}
                  <tr
                    className={`group transition-all duration-200 ${isExpanded ? "bg-slate-800/40" : "hover:bg-slate-800/20"}`}
                  >
                    <td className="p-4 text-center">
                      <button
                        onClick={() => toggleRow(stock.id)}
                        className="text-brand-accent p-1.5 hover:bg-brand-accent/20 rounded-lg transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronDown size={18} />
                        ) : (
                          <ChevronRight size={18} />
                        )}
                      </button>
                    </td>

                    {/* ASSET DETAILS: Name + Code + Exchange + Sector */}
                    <td className="p-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-base tracking-tight">
                            {stock.companyName}
                          </span>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded font-black tracking-tighter ${stock.exchange === "NSE" ? "bg-blue-500/10 text-blue-400" : "bg-orange-500/10 text-orange-400"}`}
                          >
                            {stock.exchange}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-1.5 rounded">
                            {stock.symbol}
                          </span>
                          <span className="text-[10px] text-slate-500 uppercase flex items-center gap-1">
                            <Tag size={10} /> {stock.sector}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-right font-semibold text-slate-200">
                      {totalQty}
                    </td>
                    <td className="p-4 text-right text-slate-400 font-mono font-bold text-sm">
                      ₹{Number(avgPrice).toLocaleString()}
                    </td>
                    <td className="p-4 text-right bg-slate-800/20">
                      <div
                        className={`font-mono font-bold text-sm ${
                          ltp
                            ? Number(ltp) >= Number(avgPrice)
                              ? "text-slate-400"
                              : "text-slate-400"
                            : "text-slate-600 animate-pulse"
                        }`}
                      >
                        {ltp ? `₹${ltp.toLocaleString("en-IN")}` : "---"}
                      </div>
                    </td>
                    <td className="p-4 text-right font-medium text-slate-300">
                      ₹{totalInvested.toLocaleString()}
                    </td>
                    {/* MARKET VALUE COLUMN */}
                    {/* <td className="p-4 text-right">
                      <div className="flex flex-col items-end">
                        <div
                          className={`font-bold flex items-center gap-1 ${ltp ? (isProfit ? "text-emerald-400" : "text-red-400") : "text-slate-500"}`}
                        >
                          {ltp &&
                            (isProfit ? (
                              <TrendingUp size={14} />
                            ) : (
                              <TrendingDown size={14} />
                            ))}
                          ₹{currentValue.toLocaleString()}
                        </div>
                        <div
                          className={`text-[10px] font-bold ${ltp ? (isProfit ? "text-emerald-500/80" : "text-red-500/80") : "text-slate-600"}`}
                        >
                          {ltp
                            ? `${isProfit ? "+" : ""}${pnl.toLocaleString()} (${pnlPercent}%)`
                            : "Waiting for LTP..."}
                        </div>
                      </div>
                    </td> */}
                    <td className="p-4 text-right min-w-[140px]">
                      <div className="flex flex-col items-end group/price">
                        <div
                          className={`font-bold flex items-center gap-1.5 transition-colors duration-500 ${ltp ? (isProfit ? "text-emerald-400" : "text-red-400") : "text-slate-500"}`}
                        >
                          {ltp &&
                            (isProfit ? (
                              <TrendingUp size={14} />
                            ) : (
                              <TrendingDown size={14} />
                            ))}
                          ₹{currentValue.toLocaleString("en-IN")}
                        </div>

                        {/* NEW: Explicit Current Price (LTP) Display */}
                        <div className="flex flex-col items-end mt-1">
                          {ltp ? (
                            <>
                              {/* <span className="text-[11px] font-mono text-slate-300 bg-slate-800/50 px-1.5 py-0.5 rounded border border-slate-700/50">
                                LTP: ₹{ltp.toLocaleString("en-IN")}
                              </span> */}
                              <span
                                className={`text-[10px] font-bold mt-0.5 ${isProfit ? "text-emerald-500/80" : "text-red-500/80"}`}
                              >
                                {isProfit ? "+" : ""}
                                {pnl.toLocaleString("en-IN")} ({pnlPercent}%)
                              </span>
                            </>
                          ) : (
                            <span className="text-[10px] text-slate-600 italic animate-pulse">
                              Awaiting API...
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => onDeleteStock(stock.id)}
                        className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>

                  {/* --- CHILD ROWS (INDIVIDUAL LOTS) --- */}
                  {isExpanded &&
                    stock.purchases.map((purchase) => {
                      const lotInvested = purchase.quantity * purchase.price;
                      const lotCurrentValue = ltp
                        ? purchase.quantity * ltp
                        : lotInvested;
                      const lotIsProfit = ltp ? ltp >= purchase.price : true;
                      const lotPnlPercent =
                        lotInvested > 0
                          ? (
                              ((lotCurrentValue - lotInvested) / lotInvested) *
                              100
                            ).toFixed(2)
                          : 0;

                      return (
                        <tr
                          key={purchase.id}
                          className="bg-slate-900/40 text-xs text-slate-400 border-l-2 border-brand-accent animate-in fade-in slide-in-from-left-1 duration-200"
                        >
                          <td className="p-3"></td>
                          <td className="p-3 pl-8">
                            <div className="flex items-center gap-2 opacity-70">
                              <Calendar size={12} />
                              <span>{purchase.date}</span>
                              {/* <span className="text-[9px] bg-slate-800 px-1 rounded opacity-50">
                                LOT_{purchase.id.toString().slice(-4)}
                              </span> */}
                            </div>
                          </td>
                          <td className="p-3 text-right">
                            {purchase.quantity}
                          </td>
                          <td className="p-3 text-right font-mono">
                            ₹{purchase.price.toLocaleString()}
                          </td>
                          <td className="p-3 text-right bg-slate-800/10 text-slate-400 font-mono">
                            {ltp ? `₹${ltp.toLocaleString()}` : "---"}
                          </td>
                          <td className="p-3 text-right">
                            ₹{lotInvested.toLocaleString()}
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex flex-col items-end">
                              <span
                                className={`font-semibold text-[16px] ${ltp ? (lotIsProfit ? "text-emerald-500/70" : "text-red-500/70") : ""}`}
                              >
                                ₹{lotCurrentValue.toLocaleString()}
                              </span>
                              {ltp && (
                                <span
                                  className={`text-[11px] opacity-60 ${lotIsProfit ? "text-emerald-400" : "text-red-400"}`}
                                >
                                  {lotIsProfit ? "+" : ""}
                                  {lotPnlPercent}%
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex justify-center gap-3">
                              <button
                                onClick={() => onEditPurchase(stock, purchase)}
                                className="hover:text-blue-400"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={() =>
                                  onDeletePurchase(stock.id, purchase.id)
                                }
                                className="hover:text-red-400"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PortfolioTable;
