import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Download, FileSpreadsheet, AlertCircle } from "lucide-react";
import Modal from "../../components/ui/Modal";

const ImportExcelModal = ({ isOpen, onClose, onImport }) => {
  const [previewData, setPreviewData] = useState([]);
  const [fileName, setFileName] = useState("");

  // 1. Function to download the template
  const downloadTemplate = () => {
    const templateData = [
      {
        "Company Name": "Reliance",
        Sector: "Energy",
        Quantity: 10,
        "Average Price": 2500,
      },
      {
        "Company Name": "TCS",
        Sector: "IT",
        Quantity: 5,
        "Average Price": 3200,
      },
    ];
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "Portfolio_Template.xlsx");
  };

  // 2. Function to handle file selection and preview
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);
      setPreviewData(json);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Import from Excel">
      <div className="space-y-6">
        {/* Step 1: Download */}
        <div className="flex items-center justify-between p-4 bg-brand-dark/50 border border-brand-border rounded-xl">
          <div className="flex items-center gap-3">
            <Download className="text-brand-accent" size={20} />
            <span className="text-sm font-medium">Download Excel Template</span>
          </div>
          <button
            onClick={downloadTemplate}
            className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-lg transition-colors"
          >
            Download
          </button>
        </div>

        {/* Step 2: Upload */}
        <div className="relative group">
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="border-2 border-dashed border-brand-border group-hover:border-brand-accent transition-colors rounded-xl p-8 flex flex-col items-center justify-center gap-2">
            <FileSpreadsheet
              size={32}
              className="text-slate-500 group-hover:text-brand-accent"
            />
            <p className="text-sm text-slate-400">
              {fileName ? (
                <span className="text-brand-accent font-bold">{fileName}</span>
              ) : (
                "Click or drag to upload your Excel file"
              )}
            </p>
          </div>
        </div>

        {/* Step 3: Preview Table */}
        {previewData.length > 0 && (
          <div className="max-h-48 overflow-auto border border-brand-border rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800 sticky top-0">
                <tr>
                  <th className="p-2">Company</th>
                  <th className="p-2">Qty</th>
                  <th className="p-2">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {previewData.map((row, idx) => (
                  <tr key={idx} className="bg-brand-dark/30">
                    <td className="p-2 truncate">{row["Company Name"]}</td>
                    <td className="p-2">{row["Quantity"]}</td>
                    <td className="p-2">₹{row["Average Price"]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg border border-brand-border hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={previewData.length === 0}
            onClick={() => onImport(previewData)}
            className="flex-1 px-4 py-2 rounded-lg bg-brand-accent disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold hover:bg-emerald-600 transition-colors"
          >
            Import Data
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ImportExcelModal;
