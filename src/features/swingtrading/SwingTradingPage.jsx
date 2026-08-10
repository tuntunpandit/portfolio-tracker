import React, { useMemo, useState, useEffect } from "react";
import { Plus, Search, DownloadCloud, Activity, Target, CircleDashed, TrendingUp } from "lucide-react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { fetchLivePrice } from "../../utils/marketApi";
import AddSwingTradeModal from "./AddSwingTradeModal";
import SwingTradeTable from "./SwingTradeTable";

const initialTrades = [];

const SwingTradingPage = () => {
  const [trades, setTrades] = useLocalStorage("swing_trading_data", initialTrades);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrade, setEditingTrade] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusTab, setStatusTab] = useState("all");
  const [livePrices, setLivePrices] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  const openTrades = trades.filter((trade) => trade.status === "open");
  const closedTrades = trades.filter((trade) => trade.status === "closed");

  const filteredTrades = useMemo(() => {
    return trades.filter((trade) => {
      const matchesStatus =
        statusTab === "all" ? true : trade.status === statusTab;
      const matchesSearch =
        trade.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trade.companyName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [searchQuery, statusTab, trades]);

  const summary = useMemo(() => {
    const totalTrades = trades.length;
    const totalOpen = openTrades.length;
    const totalClosed = closedTrades.length;

    const realizedPnl = closedTrades.reduce((sum, trade) => {
      const cost = trade.quantity * trade.buyPrice;
      const value = trade.quantity * (trade.sellPrice || 0);
      return sum + value - cost;
    }, 0);

    const unrealizedPnl = openTrades.reduce((sum, trade) => {
      const cost = trade.quantity * trade.buyPrice;
      const currentPrice = livePrices[trade.symbol] || trade.buyPrice;
      return sum + trade.quantity * currentPrice - cost;
    }, 0);

    const winRate =
      totalClosed === 0
        ? 0
        : Math.round(
            (closedTrades.filter((trade) => {
              const cost = trade.quantity * trade.buyPrice;
              const value = trade.quantity * (trade.sellPrice || 0);
              return value - cost > 0;
            }).length /
              totalClosed) *
              100,
          );

    return {
      totalTrades,
      totalOpen,
      totalClosed,
      realizedPnl,
      unrealizedPnl,
      winRate,
    };
  }, [trades, livePrices]);

  const fetchPrices = async () => {
    if (trades.length === 0) return;

    setIsRefreshing(true);
    const uniqueAssets = trades.reduce((acc, trade) => {
      const exists = acc.find(
        (item) => item.symbol === trade.symbol && item.exchange === trade.exchange,
      );
      if (!exists) acc.push({ symbol: trade.symbol, exchange: trade.exchange });
      return acc;
    }, []);

    const newPrices = { ...livePrices };
    for (const asset of uniqueAssets) {
      const price = await fetchLivePrice(asset.symbol, asset.exchange);
      if (price) {
        newPrices[asset.symbol] = price;
      }
    }
    setLivePrices(newPrices);
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchPrices();
  }, [trades.length]);

  const handleSaveTrade = (formData) => {
    const tradeToSave = {
      ...formData,
      symbol: formData.symbol.toUpperCase(),
      exchange: formData.exchange || "NSE",
      status: formData.sellPrice ? "closed" : "open",
      id: editingTrade ? editingTrade.id : `trade_${Date.now()}`,
    };

    setTrades((prevTrades) => {
      if (editingTrade) {
        return prevTrades.map((trade) =>
          trade.id === editingTrade.id ? { ...trade, ...tradeToSave } : trade,
        );
      }
      return [tradeToSave, ...prevTrades];
    });

    setIsModalOpen(false);
    setEditingTrade(null);
  };

  const handleEditTrade = (trade) => {
    setEditingTrade(trade);
    setIsModalOpen(true);
  };

  const handleDeleteTrade = (id) => {
    if (!window.confirm("Delete this swing trade?")) return;
    setTrades((prevTrades) => prevTrades.filter((trade) => trade.id !== id));
  };

  const cardClass =
    "bg-brand-card border border-brand-border rounded-3xl p-6 shadow-lg hover:border-brand-accent/50 transition-all";

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 pb-20">
      <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
        <div>
          <h1 className="text-4xl font-black text-white">Swing Trading</h1>
          <p className="text-slate-400 mt-2 max-w-2xl">
            Track your open and closed swing trades, measure profit/loss, and review trade performance over time.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-3xl bg-brand-accent px-5 py-3 text-sm font-bold text-slate-950 shadow-xl hover:brightness-105 transition-all"
        >
          <Plus size={18} /> Add Swing Trade
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className={cardClass}>
          <div className="flex items-center gap-3 mb-4 text-slate-400 uppercase text-xs tracking-widest">
            <Activity size={18} /> Total Trades
          </div>
          <p className="text-4xl font-black text-white">{summary.totalTrades}</p>
          <p className="text-slate-500 mt-2">Open + closed swing positions</p>
        </div>
        <div className={cardClass}>
          <div className="flex items-center gap-3 mb-4 text-slate-400 uppercase text-xs tracking-widest">
            <CircleDashed size={18} /> Open Trades
          </div>
          <p className="text-4xl font-black text-white">{summary.totalOpen}</p>
          <p className="text-slate-500 mt-2">Positions still active</p>
        </div>
        <div className={cardClass}>
          <div className="flex items-center gap-3 mb-4 text-slate-400 uppercase text-xs tracking-widest">
            <Target size={18} /> Closed Trades
          </div>
          <p className="text-4xl font-black text-white">{summary.totalClosed}</p>
          <p className="text-slate-500 mt-2">Positions already closed</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className={cardClass}>
          <div className="flex items-center gap-3 mb-4 text-slate-400 uppercase text-xs tracking-widest">
            <TrendingUp size={18} /> Realized P/L
          </div>
          <p className={`text-4xl font-black ${summary.realizedPnl >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            ₹{summary.realizedPnl.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </p>
          <p className="text-slate-500 mt-2">Profit/loss from closed trades</p>
        </div>
        <div className={cardClass}>
          <div className="flex items-center gap-3 mb-4 text-slate-400 uppercase text-xs tracking-widest">
            <Activity size={18} /> Unrealized P/L
          </div>
          <p className={`text-4xl font-black ${summary.unrealizedPnl >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            ₹{summary.unrealizedPnl.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </p>
          <p className="text-slate-500 mt-2">Estimated value for open trades</p>
        </div>
        <div className={cardClass}>
          <div className="flex items-center gap-3 mb-4 text-slate-400 uppercase text-xs tracking-widest">
            <DownloadCloud size={18} /> Win Rate
          </div>
          <p className="text-4xl font-black text-brand-accent">{summary.winRate}%</p>
          <p className="text-slate-500 mt-2">Closed trades with positive returns</p>
        </div>
      </div>

      <div className="rounded-3xl border border-brand-border bg-slate-900/40 p-5">
        <div className="flex flex-col lg:flex-row gap-4 lg:justify-between lg:items-center mb-6">
          <div className="flex flex-wrap gap-3">
            {[
              { id: "all", label: "All" },
              { id: "open", label: "Open" },
              { id: "closed", label: "Closed" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusTab(tab.id)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                  statusTab === tab.id
                    ? "bg-brand-accent text-slate-950"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative max-w-sm w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by symbol or company"
              className="w-full rounded-full border border-brand-border bg-brand-dark/80 py-3 pl-12 pr-4 text-white outline-none focus:border-brand-accent"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="text-slate-400 text-sm uppercase tracking-[0.2em]">Live data</span>
          <button
            onClick={fetchPrices}
            className="inline-flex items-center gap-2 rounded-full border border-brand-border bg-slate-800 px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 transition-all"
          >
            <Activity size={16} /> Refresh Prices
          </button>
          {isRefreshing && (
            <span className="text-slate-400 text-sm">Updating live values...</span>
          )}
        </div>

        <SwingTradeTable
          trades={filteredTrades}
          onEdit={handleEditTrade}
          onDelete={handleDeleteTrade}
          livePrices={livePrices}
        />
      </div>

      <AddSwingTradeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTrade(null);
        }}
        onSave={handleSaveTrade}
        initialData={editingTrade}
      />
    </div>
  );
};

export default SwingTradingPage;
