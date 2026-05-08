import React from "react";

const MutualFundTable = ({ data }) => {
  return (
    <div className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead className="bg-slate-900/80 text-slate-400 text-[10px] uppercase tracking-widest border-b border-brand-border">
            <tr>
              <th className="p-4">Scheme Name</th>
              <th className="p-4">Transaction Type</th>
              <th className="p-4 text-right">Units</th>
              <th className="p-4 text-right">NAV</th>
              <th className="p-4 text-right">Amount</th>
              <th className="p-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border/50">
            {data.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-slate-500 py-10">
                  No mutual fund records found.
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr key={idx}>
                  <td className="p-4">{row.schemeName}</td>
                  <td className="p-4">{row.transactionType}</td>
                  <td className="p-4 text-right">{row.units}</td>
                  <td className="p-4 text-right">{row.nav}</td>
                  <td className="p-4 text-right">{row.amount}</td>
                  <td className="p-4">{row.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MutualFundTable;
