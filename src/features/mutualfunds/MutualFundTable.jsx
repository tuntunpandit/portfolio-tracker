import React, { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";

const MutualFundTable = ({ data, navData }) => {
  console.log("MutualFundTable received data:", data);
  console.log("MutualFundTable received navData:", navData);
  const [expandedRows, setExpandedRows] = useState(new Set());

  const toggleRow = (id) => {
    const newRows = new Set(expandedRows);
    if (newRows.has(id)) newRows.delete(id);
    else newRows.add(id);
    setExpandedRows(newRows);
  };

  // Group holdings by fund
  const fundGroups = data.reduce((acc, holding) => {
    const fundKey = holding.fundId;
    if (!acc[fundKey]) {
      acc[fundKey] = {
        fundId: holding.fundId,
        isin: holding.isin,
        schemeName: holding.schemeName,
        currentNAV: holding.currentNAV,
        holdings: [],
      };
    }
    acc[fundKey].holdings.push(holding);
    return acc;
  }, {});

  const funds = Object.values(fundGroups);

  if (funds.length === 0) {
    return (
      <div className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden shadow-2xl">
        <div className="text-center text-slate-500 py-10">
          No mutual fund records found.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead className="bg-slate-900/80 text-slate-400 text-[10px] uppercase tracking-widest border-b border-brand-border">
            <tr>
              <th className="p-4 w-12 text-center">#</th>
              <th className="p-4">Scheme Details</th>
              <th className="p-4 text-right">Units</th>
              <th className="p-4 text-right">Purchase NAV</th>
              <th className="p-4 text-right bg-slate-800/30">Current NAV</th>
              <th className="p-4 text-right">Invested</th>
              <th className="p-4 text-right">Current Value</th>
              <th className="p-4 text-right">Gain/Loss</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border/50">
            {funds.map((fund, fundIdx) => {
              const isExpanded = expandedRows.has(fund.fundId);

              // Calculate fund-level totals
              const totalUnits = fund.holdings.reduce(
                (sum, h) => sum + h.units,
                0,
              );
              const totalInvested = fund.holdings.reduce(
                (sum, h) => sum + h.investedAmount,
                0,
              );
              const totalCurrentValue = totalUnits * fund.currentNAV;
              const totalGain = totalCurrentValue - totalInvested;
              const totalGainPercent =
                totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0;
              const isPositive = totalGain >= 0;

              // Calculate weighted average purchase NAV
              const avgPurchaseNAV =
                totalUnits > 0 ? totalInvested / totalUnits : 0;

              return (
                <React.Fragment key={fund.fundId}>
                  {/* --- PARENT ROW (Fund) --- */}
                  <tr
                    className={`group transition-all duration-200 ${
                      isExpanded ? "bg-slate-800/40" : "hover:bg-slate-800/20"
                    }`}
                  >
                    <td className="p-4 text-center">
                      <button
                        onClick={() => toggleRow(fund.fundId)}
                        className="text-brand-accent p-1.5 hover:bg-brand-accent/20 rounded-lg transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronDown size={18} />
                        ) : (
                          <ChevronRight size={18} />
                        )}
                      </button>
                    </td>

                    {/* Scheme Details */}
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-white text-base">
                          {fund.schemeName}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-1.5 rounded mt-1 w-fit">
                          {fund.isin}
                        </span>
                      </div>
                    </td>

                    {/* Total Units */}
                    <td className="p-4 text-right font-semibold text-slate-200">
                      {totalUnits.toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                      })}
                    </td>

                    {/* Avg Purchase NAV */}
                    <td className="p-4 text-right text-slate-400 font-mono font-bold text-sm">
                      ₹
                      {avgPurchaseNAV.toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                      })}
                    </td>

                    {/* Current NAV */}
                    <td className="p-4 text-right bg-slate-800/20">
                      <div className="font-mono font-bold text-sm text-slate-300">
                        ₹
                        {fund.currentNAV.toLocaleString("en-IN", {
                          maximumFractionDigits: 2,
                        })}
                      </div>
                    </td>

                    {/* Invested Value */}
                    <td className="p-4 text-right font-medium text-slate-300">
                      ₹
                      {totalInvested.toLocaleString("en-IN", {
                        maximumFractionDigits: 0,
                      })}
                    </td>

                    {/* Current Value */}
                    <td className="p-4 text-right font-medium text-white">
                      ₹
                      {totalCurrentValue.toLocaleString("en-IN", {
                        maximumFractionDigits: 0,
                      })}
                    </td>

                    {/* Gain/Loss with Percentage */}
                    <td
                      className={`p-4 text-right font-bold ${
                        isPositive ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {isPositive ? "+" : ""}₹
                      {totalGain.toLocaleString("en-IN", {
                        maximumFractionDigits: 0,
                      })}{" "}
                      <span className="text-xs opacity-80">
                        ({totalGainPercent.toFixed(2)}%)
                      </span>
                    </td>
                  </tr>

                  {/* --- CHILD ROWS (Holdings) --- */}
                  {isExpanded &&
                    fund.holdings.map((holding, holdingIdx) => {
                      const holdingCurrentValue =
                        holding.units * fund.currentNAV;
                      const holdingGain =
                        holdingCurrentValue - holding.investedAmount;
                      const holdingGainPercent =
                        holding.investedAmount > 0
                          ? (holdingGain / holding.investedAmount) * 100
                          : 0;
                      const holdingIsPositive = holdingGain >= 0;

                      return (
                        <tr
                          key={`${fund.fundId}-${holdingIdx}`}
                          className="bg-slate-900/30 hover:bg-slate-900/50 transition-colors border-l-2 border-brand-accent/50"
                        >
                          <td className="p-4 text-center text-slate-500 text-xs">
                            {holdingIdx + 1}
                          </td>

                          {/* Purchase Date */}
                          <td className="p-4">
                            <span className="text-xs text-slate-400">
                              {holding.purchaseDate}
                            </span>
                          </td>

                          {/* Units */}
                          <td className="p-4 text-right text-slate-300">
                            {holding.units.toLocaleString("en-IN", {
                              maximumFractionDigits: 2,
                            })}
                          </td>

                          {/* Purchase NAV */}
                          <td className="p-4 text-right text-slate-300 font-mono text-sm">
                            ₹
                            {holding.purchaseNAV.toLocaleString("en-IN", {
                              maximumFractionDigits: 2,
                            })}
                          </td>

                          {/* Current NAV */}
                          <td className="p-4 text-right bg-slate-800/20 text-slate-300 font-mono text-sm">
                            ₹
                            {fund.currentNAV.toLocaleString("en-IN", {
                              maximumFractionDigits: 2,
                            })}
                          </td>

                          {/* Invested */}
                          <td className="p-4 text-right text-slate-300">
                            ₹
                            {holding.investedAmount.toLocaleString("en-IN", {
                              maximumFractionDigits: 0,
                            })}
                          </td>

                          {/* Current Value */}
                          <td className="p-4 text-right text-slate-300">
                            ₹
                            {holdingCurrentValue.toLocaleString("en-IN", {
                              maximumFractionDigits: 0,
                            })}
                          </td>

                          {/* Gain/Loss */}
                          <td
                            className={`p-4 text-right text-sm font-medium ${
                              holdingIsPositive
                                ? "text-emerald-400"
                                : "text-red-400"
                            }`}
                          >
                            {holdingIsPositive ? "+" : ""}₹
                            {holdingGain.toLocaleString("en-IN", {
                              maximumFractionDigits: 0,
                            })}{" "}
                            <span className="text-xs opacity-80">
                              ({holdingGainPercent.toFixed(2)}%)
                            </span>
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

export default MutualFundTable;
