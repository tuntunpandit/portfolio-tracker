import React, { useState } from "react";
import { X, Upload } from "lucide-react";
import * as XLSX from "xlsx";

const ImportMutualFundModal = ({ isOpen, onClose, onImport }) => {
  const [fileName, setFileName] = useState("");
  const [data, setData] = useState([]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const wb = XLSX.read(event.target.result, { type: "binary" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(ws);
        setData(
          jsonData.filter((row) => Object.values(row).some((val) => val)),
        );
      } catch (error) {
        alert("Error parsing file: " + error.message);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleImport = () => {
    if (data.length === 0) {
      alert("Please select a file");
      return;
    }

    onImport(data);
    setFileName("");
    setData([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-brand-border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-brand-border sticky top-0 bg-slate-900">
          <h2 className="text-2xl font-black text-white">
            Import Mutual Funds
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Instructions */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <p className="text-sm text-blue-300 mb-2 font-semibold">
              CSV/Excel Format Required
            </p>
            <p className="text-xs text-blue-200">
              Your file should have columns: ISIN, Scheme Name, Fund House,
              Category, Units, Purchase NAV, Purchase Date
            </p>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Select CSV or Excel File
            </label>
            <div className="relative">
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-700 rounded-lg cursor-pointer hover:border-brand-accent transition-colors"
              >
                <Upload size={20} className="text-slate-400" />
                <span className="text-slate-300">
                  {fileName || "Click to upload file"}
                </span>
              </label>
            </div>
          </div>

          {/* Preview */}
          {data.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-slate-300 mb-2">
                Preview ({data.length} records)
              </p>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 max-h-48 overflow-y-auto">
                <table className="w-full text-xs text-slate-300">
                  <thead className="text-slate-400 border-b border-slate-700 mb-2">
                    <tr>
                      {Object.keys(data[0] || {}).map((key) => (
                        <th key={key} className="text-left py-2 px-2">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.slice(0, 5).map((row, idx) => (
                      <tr key={idx} className="border-t border-slate-700">
                        {Object.values(row).map((val, i) => (
                          <td key={i} className="py-2 px-2 truncate">
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {data.length > 5 && (
                  <p className="text-xs text-slate-500 mt-2">
                    ... and {data.length - 5} more
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={data.length === 0}
              className="flex-1 px-4 py-2 bg-brand-accent text-white rounded-lg hover:brightness-110 transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Import {data.length > 0 ? `(${data.length})` : ""}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportMutualFundModal;
