import React, { useState } from "react";
import { X } from "lucide-react";

const AddMutualFundModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    isin: "",
    schemeName: "",
    fundHouse: "",
    category: "",
    units: "",
    purchaseNAV: "",
    purchaseDate: "",
  });

  const categories = [
    "Large Cap",
    "Mid Cap",
    "Small Cap",
    "Multi Cap",
    "Balanced",
    "Debt",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.isin ||
      !formData.schemeName ||
      !formData.fundHouse ||
      !formData.category ||
      !formData.units ||
      !formData.purchaseNAV ||
      !formData.purchaseDate
    ) {
      alert("Please fill all fields");
      return;
    }

    onSave(formData);
    setFormData({
      isin: "",
      schemeName: "",
      fundHouse: "",
      category: "",
      units: "",
      purchaseNAV: "",
      purchaseDate: "",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-brand-border rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-brand-border sticky top-0 bg-slate-900">
          <h2 className="text-2xl font-black text-white">Add Mutual Fund</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* ISIN */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              ISIN
            </label>
            <input
              type="text"
              name="isin"
              value={formData.isin}
              onChange={handleChange}
              placeholder="e.g., INF846K01XX0"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-brand-accent outline-none transition-colors"
            />
          </div>

          {/* Scheme Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Scheme Name
            </label>
            <input
              type="text"
              name="schemeName"
              value={formData.schemeName}
              onChange={handleChange}
              placeholder="e.g., Nippon India Growth Fund"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-brand-accent outline-none transition-colors"
            />
          </div>

          {/* Fund House */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Fund House
            </label>
            <input
              type="text"
              name="fundHouse"
              value={formData.fundHouse}
              onChange={handleChange}
              placeholder="e.g., Nippon Life"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-brand-accent outline-none transition-colors"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-brand-accent outline-none transition-colors"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Units */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Units
            </label>
            <input
              type="number"
              name="units"
              step="0.01"
              value={formData.units}
              onChange={handleChange}
              placeholder="e.g., 50"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-brand-accent outline-none transition-colors"
            />
          </div>

          {/* Purchase NAV */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Purchase NAV
            </label>
            <input
              type="number"
              name="purchaseNAV"
              step="0.01"
              value={formData.purchaseNAV}
              onChange={handleChange}
              placeholder="e.g., 250"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-brand-accent outline-none transition-colors"
            />
          </div>

          {/* Purchase Date */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Purchase Date
            </label>
            <input
              type="date"
              name="purchaseDate"
              value={formData.purchaseDate}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-brand-accent outline-none transition-colors"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-brand-accent text-white rounded-lg hover:brightness-110 transition-all font-bold"
            >
              Add Fund
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMutualFundModal;
