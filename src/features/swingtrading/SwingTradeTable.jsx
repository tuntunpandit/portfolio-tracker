import React from "react";
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  Edit2,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const SwingTradeTable = ({ trades, onEdit, onDelete, livePrices }) => {
  const formatCurrency = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

  return (
    <div className="bg-brand-card border border-brand-border rounded-3xl overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-250">
          <thead className="bg-slate-900/80 text-slate-400 text-[10px] uppercase tracking-widest border-b border-brand-border">
            <tr>
              <th className="p-4">Trade</th>
              <th className="p-4 text-right">Qty</th>
              <th className="p-4 text-right">Buy</th>
              <th className="p-4 text-right">Sell</th>
              <th className="p-4 text-right">P/L</th>
              <th className="p-4 text-right">Status</th>
              <th className="p-4 text-right">Duration</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border/50">
            {trades.map((trade) => {
              const totalCost = trade.quantity * trade.buyPrice;
              const soldValue = trade.sellPrice ? trade.quantity * trade.sellPrice : 0;
              const livePrice = livePrices?.[trade.symbol];
              const currentValue = trade.status === "open" ? trade.quantity * (livePrice || trade.buyPrice) : soldValue;
              const pnl = trade.status === "closed" ? soldValue - totalCost : currentValue - totalCost;
              const pnlPercent = totalCost > 0 ? ((pnl / totalCost) * 100).toFixed(2) : "0.00";
              const isProfit = pnl >= 0;
              const duration = trade.sellDate
                ? Math.max(
                    0,
                    Math.round(
                      (new Date(trade.sellDate) - new Date(trade.buyDate)) /
                        (1000 * 60 * 60 * 24),
                    ),
                  )
                : Math.max(
                    0,
                    Math.round(
                      (Date.now() - new Date(trade.buyDate)) /
                        (1000 * 60 * 60 * 24),
                    ),
                  );

              return (
                <tr key={trade.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{trade.companyName || trade.symbol}</span>
                        <span className="text-[11px] uppercase px-2 py-1 rounded-full bg-slate-800 text-slate-400">
                          {trade.symbol}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <Calendar size={12} /> Buy: {trade.buyDate}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right font-semibold text-slate-200">{trade.quantity}</td>
                  <td className="p-4 text-right font-mono text-slate-300">{formatCurrency(trade.buyPrice)}</td>
                  <td className="p-4 text-right font-mono text-slate-300">
                    {trade.sellPrice ? formatCurrency(trade.sellPrice) : "--"}
                  </td>
                  <td className="p-4 text-right">
                    <div className="inline-flex items-center gap-2 rounded-2xl px-3 py-2 font-semibold text-sm" style={{ backgroundColor: isProfit ? "rgba(16,185,129,0.12)" : "rgba(248,113,113,0.12)", color: isProfit ? "#10B981" : "#F87171" }}>
                      {isProfit ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                      <span>{formatCurrency(pnl)}</span>
                      <span className="text-[11px] text-slate-400">({isProfit ? "+" : ""}{pnlPercent}%)</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold ${trade.status === "closed" ? "bg-slate-800 text-slate-300" : "bg-brand-accent/10 text-brand-accent"}`}>
                      {trade.status === "closed" ? <ArrowDownRight size={12} /> : <ArrowUpRight size={12} />}
                      {trade.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-right text-slate-300">{duration}d</td>
                  <td className="p-4 text-center flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEdit(trade)}
                      className="p-2 rounded-xl bg-slate-900 text-slate-300 hover:bg-slate-800 transition-all"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(trade.id)}
                      className="p-2 rounded-xl bg-slate-900 text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SwingTradeTable;
