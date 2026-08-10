import React, { useState, useEffect } from "react";
import { Plus, FileUp, RefreshCcw, Loader } from "lucide-react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { fetchMutualFundNAV } from "../../utils/marketApi";
import mockData from "../../assets/mocks/mutual-funds.json";
import MutualFundTable from "./MutualFundTable";
import AddMutualFundModal from "./AddMutualFundModal";
import ImportMutualFundModal from "./ImportMutualFundModal";

const MutualFundPage = () => {
  const [mutualFunds, setMutualFunds] = useLocalStorage(
    "mutual_funds_data",
    [],
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [navData, setNavData] = useState({});
  const [fetchingFund, setFetchingFund] = useState("");
  const [fetchProgress, setFetchProgress] = useState(0);

  // Flatten all holdings from all funds for display
  const allHoldings = mutualFunds.flatMap((fund) =>
    fund.holdings.map((holding) => ({
      ...holding,
      fundId: fund.id,
      isin: fund.isin,
      schemeName: fund.schemeName,
      fundHouse: fund.fundHouse,
      category: fund.category,
      currentNAV: navData[fund.isin] || 0,
    })),
  );

  // Fetch NAV data
  const refreshNAV = async () => {
    setIsRefreshing(true);
    const navMap = { ...navData };
    const totalFunds = mutualFunds.length;

    for (let index = 0; index < mutualFunds.length; index++) {
      const fund = mutualFunds[index];
      setFetchingFund(fund.schemeName);
      setFetchProgress(Math.round(((index + 1) / totalFunds) * 100));

      const nav = await fetchMutualFundNAV(fund.schemeCode, fund.schemeName);
      if (nav) {
        navMap[fund.isin] = nav;
      }
    }
    console.log("NAV refresh complete. Updated NAV data:", navMap);
    setNavData(navMap);
    setIsRefreshing(false);
    setFetchingFund("");
    setFetchProgress(0);
  };

  // Fetch NAV on mount and when funds change
  useEffect(() => {
    if (mutualFunds.length > 0) {
      refreshNAV();
    }
  }, [mutualFunds.length]);

  // Handle add mutual fund
  const handleAddMutualFund = (formData) => {
    const newFund = {
      id: `mf_${Date.now()}`,
      isin: formData.isin,
      schemeName: formData.schemeName,
      fundHouse: formData.fundHouse,
      category: formData.category,
      holdings: [
        {
          id: `holding_${Date.now()}`,
          units: parseFloat(formData.units),
          purchaseNAV: parseFloat(formData.purchaseNAV),
          purchaseDate: formData.purchaseDate,
          investedAmount:
            parseFloat(formData.units) * parseFloat(formData.purchaseNAV),
        },
      ],
    };

    setMutualFunds((prev) => [...prev, newFund]);
    setIsAddModalOpen(false);
  };

  // Handle import mutual funds
  const handleImportMutualFunds = (data) => {
    const importedFunds = data.map((row) => ({
      id: `mf_${Date.now()}_${Math.random()}`,
      isin: row["ISIN"] || row["isin"] || "",
      schemeName: row["Scheme Name"] || row["schemeName"] || "",
      fundHouse: row["Fund House"] || row["fundHouse"] || "",
      category: row["Category"] || row["category"] || "",
      holdings: [
        {
          id: `holding_${Date.now()}_${Math.random()}`,
          units: parseFloat(row["Units"] || row["units"] || 0),
          purchaseNAV: parseFloat(
            row["Purchase NAV"] || row["purchaseNAV"] || 0,
          ),
          purchaseDate: row["Purchase Date"] || row["purchaseDate"] || "",
          investedAmount:
            parseFloat(row["Units"] || row["units"] || 0) *
            parseFloat(row["Purchase NAV"] || row["purchaseNAV"] || 0),
        },
      ],
    }));

    setMutualFunds((prev) => [...prev, ...importedFunds]);
    setIsImportModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20 px-4">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-white mb-2">Mutual Funds</h1>
        <p className="text-slate-400">
          Track and manage your mutual fund investments
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 w-full lg:w-auto mb-6 flex-wrap">
        <button
          onClick={() => setIsImportModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 border border-brand-border rounded-xl text-slate-300 hover:bg-brand-card transition-all font-semibold"
        >
          <FileUp size={18} />
          Import
        </button>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-accent text-white rounded-xl font-bold hover:brightness-110 shadow-lg active:scale-95 transition-all"
        >
          <Plus size={18} />
          Add Mutual Fund
        </button>
        <button
          onClick={refreshNAV}
          disabled={isRefreshing}
          className="flex items-center justify-center gap-2 px-6 py-3 border border-brand-border rounded-xl text-slate-300 hover:bg-brand-card transition-all font-semibold disabled:opacity-50"
        >
          <RefreshCcw
            size={18}
            className={isRefreshing ? "animate-spin" : ""}
          />
          Refresh NAV
        </button>
      </div>

      {/* Loading Indicator */}
      {isRefreshing && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <Loader className="animate-spin text-blue-400" size={20} />
            <div className="flex-1">
              <p className="text-sm font-semibold text-blue-300">
                Updating NAV data...
              </p>
              <p className="text-xs text-blue-200 truncate">{fetchingFund}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-slate-800/50 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-300"
              style={{ width: `${fetchProgress}%` }}
            />
          </div>

          <p className="text-xs text-blue-300 mt-2">
            {fetchProgress}% complete
          </p>
        </div>
      )}

      {/* Load Mock Data Button */}
      <div className="text-center">
        <button
          onClick={() => {
            setMutualFunds(mockData.funds);
            alert("Mock mutual fund data loaded into local storage!");
          }}
          className="text-emerald-400 underline hover:text-emerald-300 cursor-pointer"
        >
          Load Mock Data
        </button>
      </div>

      {/* Table */}
      <div
        className={`transition-opacity duration-300 ${isRefreshing ? "opacity-60 pointer-events-none" : "opacity-100"}`}
      >
        <MutualFundTable data={allHoldings} navData={navData} />
      </div>

      {/* Modals */}
      <AddMutualFundModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddMutualFund}
      />
      <ImportMutualFundModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportMutualFunds}
      />
    </div>
  );
};

export default MutualFundPage;
