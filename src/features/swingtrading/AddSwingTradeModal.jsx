import React, { useState, useEffect } from "react";
import Modal from "../../components/ui/Modal";

const initialTradeState = {
  companyName: "",
  symbol: "",
  exchange: "NSE",
  quantity: "",
  buyDate: "",
  buyPrice: "",
  sellDate: "",
  sellPrice: "",
  status: "open",
  notes: "",
  stopLoss: "",
  target: "",
};

const AddSwingTradeModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState(initialTradeState);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialTradeState,
        ...initialData,
        quantity: initialData.quantity || "",
        buyPrice: initialData.buyPrice || "",
        sellPrice: initialData.sellPrice || "",
      });
    } else {
      setFormData(initialTradeState);
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave({
      ...formData,
      quantity: Number(formData.quantity),
      buyPrice: Number(formData.buyPrice),
      sellPrice: formData.sellPrice ? Number(formData.sellPrice) : null,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Swing Trade" : "Add Swing Trade"}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1 uppercase font-bold">
              Symbol
            </label>
            <input
              name="symbol"
              value={formData.symbol}
              onChange={handleChange}
              placeholder="RELIANCE"
              className="w-full bg-brand-dark border border-brand-border rounded-lg px-4 py-2 text-white outline-none focus:border-brand-accent"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1 uppercase font-bold">
              Company Name
            </label>
            <input
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Reliance Industries"
              className="w-full bg-brand-dark border border-brand-border rounded-lg px-4 py-2 text-white outline-none focus:border-brand-accent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1 uppercase font-bold">
              Exchange
            </label>
            <select
              name="exchange"
              value={formData.exchange}
              onChange={handleChange}
              className="w-full bg-brand-dark border border-brand-border rounded-lg px-4 py-2 text-white outline-none focus:border-brand-accent"
            >
              <option value="NSE">NSE</option>
              <option value="BSE">BSE</option>
            </select>
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
              className="w-full bg-brand-dark border border-brand-border rounded-lg px-4 py-2 text-white outline-none focus:border-brand-accent"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1 uppercase font-bold">
              Buy Price
            </label>
            <input
              name="buyPrice"
              type="number"
              value={formData.buyPrice}
              onChange={handleChange}
              className="w-full bg-brand-dark border border-brand-border rounded-lg px-4 py-2 text-white outline-none focus:border-brand-accent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1 uppercase font-bold">
              Buy Date
            </label>
            <input
              name="buyDate"
              type="date"
              value={formData.buyDate}
              onChange={handleChange}
              className="w-full bg-brand-dark border border-brand-border rounded-lg px-4 py-2 text-white outline-none focus:border-brand-accent"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1 uppercase font-bold">
              Sell Date
            </label>
            <input
              name="sellDate"
              type="date"
              value={formData.sellDate}
              onChange={handleChange}
              className="w-full bg-brand-dark border border-brand-border rounded-lg px-4 py-2 text-white outline-none focus:border-brand-accent"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1 uppercase font-bold">
              Sell Price
            </label>
            <input
              name="sellPrice"
              type="number"
              value={formData.sellPrice || ""}
              onChange={handleChange}
              className="w-full bg-brand-dark border border-brand-border rounded-lg px-4 py-2 text-white outline-none focus:border-brand-accent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1 uppercase font-bold">
              Stop Loss
            </label>
            <input
              name="stopLoss"
              type="number"
              value={formData.stopLoss}
              onChange={handleChange}
              className="w-full bg-brand-dark border border-brand-border rounded-lg px-4 py-2 text-white outline-none focus:border-brand-accent"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1 uppercase font-bold">
              Target
            </label>
            <input
              name="target"
              type="number"
              value={formData.target}
              onChange={handleChange}
              className="w-full bg-brand-dark border border-brand-border rounded-lg px-4 py-2 text-white outline-none focus:border-brand-accent"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1 uppercase font-bold">
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            className="w-full bg-brand-dark border border-brand-border rounded-lg px-4 py-2 text-white outline-none focus:border-brand-accent"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-brand-accent text-white font-bold rounded-xl hover:brightness-110 transition-all"
        >
          {initialData ? "Update Trade" : "Save Swing Trade"}
        </button>
      </div>
    </Modal>
  );
};

export default AddSwingTradeModal;
