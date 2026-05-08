import React, { useState } from "react";
import MutualFundTable from "./MutualFundTable";
import AddMutualFundModal from "./AddMutualFundModal";
import ImportMutualFundModal from "./ImportMutualFundModal";

const MutualFundPage = () => {
  const [funds, setFunds] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Add, edit, delete, import logic will go here

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20 px-4">
      <div className="flex gap-3 w-full lg:w-auto mb-6">
        <button
          onClick={() => setIsImportModalOpen(true)}
          className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 border border-brand-border rounded-xl text-slate-300 hover:bg-brand-card transition-all font-semibold"
        >
          Import
        </button>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-brand-accent text-white rounded-xl font-bold hover:brightness-110 shadow-lg active:scale-95 transition-all"
        >
          Add Mutual Fund
        </button>
      </div>
      <MutualFundTable data={funds} />
      <AddMutualFundModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={() => {}}
      />
      <ImportMutualFundModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={() => {}}
      />
    </div>
  );
};

export default MutualFundPage;
