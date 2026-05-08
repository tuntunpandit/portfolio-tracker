import React, { useState, useEffect } from "react";
import Modal from "../../components/ui/Modal";

const AddStockModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    companyName: "",
    symbol: "", // New Field
    exchange: "NSE", // New Field
    sector: "",
    quantity: "",
    price: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        companyName: "",
        symbol: "",
        exchange: "NSE",
        sector: "",
        quantity: "",
        price: "",
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Purchase" : "Add New Stock"}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1 uppercase font-bold">
              Exchange
            </label>
            <select
              name="exchange"
              value={formData.exchange}
              onChange={handleChange}
              className="w-full bg-brand-dark border border-brand-border rounded-lg px-4 py-2 outline-none focus:border-brand-accent text-white"
            >
              <option value="NSE">NSE</option>
              <option value="BSE">BSE</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1 uppercase font-bold">
              Company Code (Symbol)
            </label>
            <input
              name="symbol"
              value={formData.symbol}
              onChange={handleChange}
              placeholder="e.g. RELIANCE"
              className="w-full bg-brand-dark border border-brand-border rounded-lg px-4 py-2 outline-none focus:border-brand-accent text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1 uppercase font-bold">
            Display Name
          </label>
          <input
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="e.g. Reliance Industries"
            className="w-full bg-brand-dark border border-brand-border rounded-lg px-4 py-2 outline-none focus:border-brand-accent text-white"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1">
            <label className="block text-xs text-slate-400 mb-1 uppercase font-bold">
              Sector
            </label>
            <input
              name="sector"
              value={formData.sector}
              onChange={handleChange}
              className="w-full bg-brand-dark border border-brand-border rounded-lg px-4 py-2 outline-none focus:border-brand-accent text-white"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1 uppercase font-bold">
              Quantity
            </label>
            <input
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full bg-brand-dark border border-brand-border rounded-lg px-4 py-2 outline-none focus:border-brand-accent text-white"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1 uppercase font-bold">
              Buy Price
            </label>
            <input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              className="w-full bg-brand-dark border border-brand-border rounded-lg px-4 py-2 outline-none focus:border-brand-accent text-white"
            />
          </div>
        </div>

        <button
          onClick={() => onSave(formData)}
          className="w-full py-3 bg-brand-accent text-white font-bold rounded-xl mt-4 hover:brightness-110 transition-all"
        >
          {initialData ? "Update Entry" : "Add to Portfolio"}
        </button>
      </div>
    </Modal>
  );
};
export default AddStockModal;
