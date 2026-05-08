import React, { useState, useMemo, useEffect } from "react";
import {
  Plus,
  FileUp,
  PackageOpen,
  Search,
  Filter,
  X,
  RefreshCcw,
} from "lucide-react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { fetchLivePrice } from "../../utils/marketApi";
import StatsCards from "./StatsCards";
import AddStockModal from "./AddStockModal";
import ImportExcelModal from "./ImportExcelModal";
import PortfolioTable from "./PortfolioTable";

const PortfolioPage = () => {
  // 1. UI & Filter State
  const [activeTab, setActiveTab] = useState("Zerodha");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState("All");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 2. Data & Live Price State
  const [livePrices, setLivePrices] = useState({});
  const [portfolioData, setPortfolioData] = useLocalStorage(
    "portfolio_app_data",
    {
      Zerodha: [],
      Groww: [],
      "Angel One": [],
    },
  );

  const [editingInfo, setEditingInfo] = useState(null);
  const [editInitialData, setEditInitialData] = useState(null);

  const brokers = ["Zerodha", "Groww", "Angel One"];

  // 3. Market Data Logic
  const refreshMarketPrices = async () => {
    if (portfolioData[activeTab].length === 0) return;

    setIsRefreshing(true);

    // 1. Create a unique list of objects containing both Symbol and Exchange
    const uniqueAssets = portfolioData[activeTab].reduce((acc, stock) => {
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

    // 2. Pass both arguments to the fetch function
    for (const asset of uniqueAssets) {
      const price = await fetchLivePrice(asset.symbol, asset.exchange);

      if (price) {
        // We still use the symbol as the key for the priceMap
        priceMap[asset.symbol] = price;
      }
    }

    setLivePrices(priceMap);
    setIsRefreshing(false);
  };

  // Initial load and auto-refresh every 60 seconds
  // useEffect(() => {
  //   refreshMarketPrices();
  //   const interval = setInterval(refreshMarketPrices, 60000);
  //   return () => clearInterval(interval);
  // }, [activeTab, portfolioData[activeTab].length]);

  useEffect(() => {
    // Always fetch live prices on load and tab switch
    refreshMarketPrices();
    // No setInterval needed!
  }, [activeTab, portfolioData[activeTab].length]);
  // 4. Save/Edit Logic
  const handleSaveStock = (formData) => {
    setPortfolioData((prev) => {
      const currentBrokerData = [...prev[activeTab]];

      if (editingInfo) {
        // --- EDIT MODE ---
        // Updates a specific purchase within a specific stock group
        const updatedData = currentBrokerData.map((stock) => {
          if (stock.id === editingInfo.stockId) {
            return {
              ...stock,
              companyName: formData.companyName, // Allow updating display name
              symbol: formData?.symbol?.toUpperCase(), // Sync symbol
              exchange: formData?.exchange,
              sector: formData?.sector,
              date: formData?.date,
              purchases: stock.purchases.map((p) =>
                p.id === editingInfo.purchaseId
                  ? {
                      ...p,
                      quantity: Number(formData.quantity),
                      price: Number(formData.price),
                    }
                  : p,
              ),
            };
          }
          return stock;
        });
        return { ...prev, [activeTab]: updatedData };
      } else {
        // --- ADD MODE ---
        // Check if this stock (Symbol + Exchange) already exists in this broker
        const existingStockIdx = currentBrokerData.findIndex(
          (s) =>
            s?.symbol?.toUpperCase() === formData?.symbol?.toUpperCase() &&
            s?.exchange === formData?.exchange,
        );

        const newPurchase = {
          id: Math.random(Date.now()) * 100000000, // Unique ID for the specific purchase lot
          quantity: Number(formData.quantity),
          price: Number(formData.price),
          date: excelDateToJSDate(formData.date).toISOString().split("T")[0],
        };
        if (existingStockIdx > -1) {
          // Option A: Stock exists, add a new "branch" to the tree
          const updatedStock = { ...currentBrokerData[existingStockIdx] };
          updatedStock.purchases = [...updatedStock.purchases, newPurchase];

          // Update display name/sector in case the user entered them differently
          updatedStock.companyName = formData.companyName;
          updatedStock.sector = formData.sector;

          currentBrokerData[existingStockIdx] = updatedStock;
        } else {
          // Option B: New Stock, create the "root" of the tree
          currentBrokerData.push({
            id: `stock_${Date.now()}`, // Unique ID for the grouping
            companyName: formData.companyName,
            symbol: formData?.symbol?.toUpperCase(),
            exchange: formData?.exchange,
            sector: formData?.sector,
            purchases: [newPurchase],
          });
        }
        return { ...prev, [activeTab]: currentBrokerData };
      }
    });

    // Reset UI states after saving
    setIsAddModalOpen(false);
    setEditingInfo(null);
    setEditInitialData(null);
  };

  // 5. Delete Logic
  const handleDeleteStock = (stockId) => {
    if (window.confirm("Delete this entire stock history?")) {
      setPortfolioData((prev) => ({
        ...prev,
        [activeTab]: prev[activeTab].filter((s) => s.id !== stockId),
      }));
    }
  };

  const handleDeletePurchase = (stockId, purchaseId) => {
    setPortfolioData((prev) => {
      const updated = prev[activeTab]
        .map((stock) => {
          if (stock.id === stockId) {
            return {
              ...stock,
              purchases: stock.purchases.filter((p) => p.id !== purchaseId),
            };
          }
          return stock;
        })
        .filter((stock) => stock.purchases.length > 0);
      return { ...prev, [activeTab]: updated };
    });
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setEditingInfo(null);
    setEditInitialData(null);
  };

  // 6. Filtering & Derived Stats
  const sectors = useMemo(() => {
    const all = portfolioData[activeTab].map((s) => s.sector);
    return ["All", ...new Set(all)];
  }, [portfolioData, activeTab]);

  const filteredData = useMemo(() => {
    return portfolioData[activeTab].filter((stock) => {
      const matchesSearch =
        stock.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.sector.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSector =
        selectedSector === "All" || stock.sector === selectedSector;
      return matchesSearch && matchesSector;
    });
  }, [portfolioData, activeTab, searchQuery, selectedSector]);

  const stats = useMemo(() => {
    const invested = filteredData.reduce(
      (acc, s) =>
        acc + s.purchases.reduce((sum, p) => sum + p.quantity * p.price, 0),
      0,
    );

    const currentVal = filteredData.reduce((acc, s) => {
      const qty = s.purchases.reduce((sum, p) => sum + p.quantity, 0);
      const ltp = livePrices[s.symbol] || invested / qty || 0;
      return acc + qty * ltp;
    }, 0);

    return { count: filteredData.length, invested, value: currentVal };
  }, [filteredData, livePrices]);

  const excelDateToJSDate = (serial) => {
    // If the value is already a string/Date, just return it
    if (isNaN(serial)) return serial;

    // Excel's epoch is 1899-12-30
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    const date_info = new Date(utc_value * 1000);

    return new Date(
      date_info.getFullYear(),
      date_info.getMonth(),
      date_info.getDate(),
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20 px-4">
      {/* Header Actions */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-white">Portfolio Manager</h2>
            {isRefreshing && (
              <RefreshCcw
                size={16}
                className="animate-spin text-brand-accent"
              />
            )}
          </div>
          <div className="flex gap-1 bg-brand-card p-1 rounded-xl border border-brand-border w-fit shadow-2xl">
            {brokers.map((b) => (
              <button
                key={b}
                onClick={() => {
                  setActiveTab(b);
                  setSelectedSector("All");
                  setSearchQuery("");
                }}
                className={`px-6 py-2 rounded-lg font-bold transition-all duration-300 ${
                  activeTab === b
                    ? "bg-brand-accent text-white shadow-lg"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 w-full lg:w-auto">
          <button
            onClick={refreshMarketPrices}
            className="p-3 border border-brand-border rounded-xl text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCcw
              size={20}
              className={isRefreshing ? "animate-spin" : ""}
            />
          </button>
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 border border-brand-border rounded-xl text-slate-300 hover:bg-brand-card transition-all font-semibold"
          >
            <FileUp size={18} /> Import
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-brand-accent text-white rounded-xl font-bold hover:brightness-110 shadow-lg active:scale-95 transition-all"
          >
            <Plus size={18} /> Add Stock
          </button>
        </div>
      </div>

      <StatsCards
        count={stats.count}
        invested={stats.invested}
        value={stats.value}
      />

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 bg-brand-card/30 p-4 rounded-2xl border border-brand-border backdrop-blur-sm">
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            size={18}
          />
          <input
            type="text"
            placeholder="Search company or sector..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-brand-dark/50 border border-brand-border rounded-xl pl-12 pr-10 py-3 focus:border-brand-accent outline-none text-white"
          />
          {searchQuery && (
            <X
              size={18}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 cursor-pointer"
              onClick={() => setSearchQuery("")}
            />
          )}
        </div>

        <div className="flex items-center gap-3 bg-brand-dark/50 border border-brand-border rounded-xl px-4 min-w-[220px]">
          <Filter size={18} className="text-slate-500" />
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="bg-transparent text-slate-300 w-full py-3 outline-none cursor-pointer font-medium"
          >
            {sectors.map((s) => (
              <option key={s} value={s} className="bg-brand-dark">
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Section */}
      {filteredData.length > 0 ? (
        <PortfolioTable
          data={filteredData}
          livePrices={livePrices}
          onDeleteStock={handleDeleteStock}
          onDeletePurchase={handleDeletePurchase}
          onEditPurchase={(stock, purchase) => {
            setEditingInfo({ stockId: stock.id, purchaseId: purchase.id });
            setEditInitialData({
              companyName: stock.companyName,
              symbol: stock.symbol, // <--- Make sure this is included
              exchange: stock.exchange, // <--- Make sure this is included
              sector: stock.sector,
              quantity: purchase.quantity,
              price: purchase.price,
              date: stock?.date ? new Date(stock.date) : new Date(),
            });
            setIsAddModalOpen(true);
          }}
        />
      ) : (
        <div className="bg-brand-card/20 border-2 border-dashed border-brand-border rounded-3xl py-24 flex flex-col items-center justify-center text-slate-500">
          <PackageOpen size={64} className="opacity-10 mb-4" />
          <h3 className="text-xl font-bold text-slate-400">No stocks found</h3>
        </div>
      )}

      {/* Modals */}
      <AddStockModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onSave={handleSaveStock}
        initialData={editInitialData}
      />
      <ImportExcelModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={(data) => {
          console.log(data);
          data.forEach((row) =>
            handleSaveStock({
              companyName: row["Company Name"],
              sector: row["Sector"],
              quantity: row["Quantity"],
              price: row["Average Price"],
              exchange: row["Exchange"],
              symbol: row["Symbol"],
              date: row["Date"],
            }),
          );
          setIsImportModalOpen(false);
        }}
      />

      {/* CORS Anywhere Demo Link */}
      <div className="mt-10 text-center">
        <a
          href="https://cors-anywhere.herokuapp.com/corsdemo"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 underline hover:text-blue-300"
        >
          Enable CORS Proxy (CORS Anywhere)
        </a>
      </div>
    </div>
  );
};

export default PortfolioPage;
