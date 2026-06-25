import React, { useState } from "react";
import { Invoice } from "../types";
import { 
  Search, 
  Trash2, 
  FileText, 
  Calendar, 
  User, 
  Car, 
  ChevronRight, 
  SlidersHorizontal,
  FileCheck,
  AlertTriangle
} from "lucide-react";

interface HistoryListProps {
  invoices: Invoice[];
  onViewInvoice: (invoice: Invoice) => void;
  onDeleteInvoice: (id: string) => void;
}

export default function HistoryList({ invoices, onViewInvoice, onDeleteInvoice }: HistoryListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [minAmount, setMinAmount] = useState<number>(0);
  const [showFilters, setShowFilters] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);

  // Filter implementation
  const filteredInvoices = invoices.filter((inv) => {
    const term = searchTerm.toLowerCase();
    const matchSearch = 
      inv.id.toLowerCase().includes(term) ||
      inv.customerName.toLowerCase().includes(term) ||
      inv.mobileNumber.toLowerCase().includes(term) ||
      inv.vehicleNumber.toLowerCase().includes(term);

    const matchAmount = inv.finalAmount >= minAmount;

    return matchSearch && matchAmount;
  });

  const formatDateLabel = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    } catch {
      return dateStr;
    }
  };

  const handleDeleteConfirm = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid opening the invoice
    setIdToDelete(id);
  };

  const handleExecuteDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (idToDelete) {
      onDeleteInvoice(idToDelete);
      setIdToDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900">
            Historic Archives & Deeds (SQLite)
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Query and filter the active database history of signed vehicle fine clearances and advisory deeds.
          </p>
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center space-x-2 px-3.5 py-1.5 border rounded-lg text-xs font-medium cursor-pointer transition-colors ${
            showFilters || minAmount > 0
            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
          }`}
        >
          <SlidersHorizontal size={14} />
          <span>Detailed Filters</span>
        </button>
      </div>

      {/* FILTER CONTROLS BAR */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Main search box */}
          <div className="relative md:col-span-8">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Query by Client Name, Mobile, Vehicle Reg (MH-12-...), or unique Invoice ID..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-hidden transition-all placeholder:text-slate-400 font-medium"
            />
          </div>

          <div className="md:col-span-4 flex items-center justify-between text-xs font-mono text-slate-400 pl-2">
            <span>Result Count: <b>{filteredInvoices.length}</b> records matching</span>
          </div>

        </div>

        {/* SLIDABLE DETAILED FILTERS */}
        {(showFilters || minAmount > 0) && (
          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono font-bold text-slate-500">
                <span>MINIMUM BILLING SPECIFICATION</span>
                <span className="text-slate-700 bg-slate-150 px-2 py-0.5 rounded">₹{minAmount.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="0"
                max="25000"
                step="500"
                value={minAmount}
                onChange={(e) => setMinAmount(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>0</span>
                <span>₹10,000</span>
                <span>₹20,000</span>
                <span>₹25,000+</span>
              </div>
            </div>

            <div className="flex items-end justify-end space-x-2">
              {minAmount > 0 && (
                <button
                  type="button"
                  onClick={() => setMinAmount(0)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-xs font-medium cursor-pointer"
                >
                  Reset amount
                </button>
              )}
            </div>

          </div>
        )}

      </div>

      {/* COMPACT MODIFIED WARNING DIALOG BOX ON DELETE */}
      {idToDelete && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3.5 shadow-sm animate-fade-in">
          <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-900 text-sm">Execute Client Deed Deletion?</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              This action permanent deletes the clearance invoice reference <code className="font-mono bg-amber-100 text-amber-850 px-1 py-0.5 rounded font-bold">{idToDelete}</code> from the SQLite persistent state. Associated challan indexes will be unlinked. Do you wish to continue?
            </p>
            <div className="flex items-center space-x-2 pt-1">
              <button
                onClick={handleExecuteDelete}
                className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-bold shadow-xs cursor-pointer transition-colors"
              >
                Confirm Delete
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setIdToDelete(null); }}
                className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 rounded text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DENSE RECORDS SHEET TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredInvoices.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <div className="h-10 w-10 text-slate-300 mx-auto flex items-center justify-center bg-slate-50 border border-slate-100 rounded-lg">
              <FileText size={20} />
            </div>
            <h3 className="text-slate-800 font-semibold text-sm">No transaction matches located</h3>
            <p className="text-slate-400 text-xs max-w-sm mx-auto">
              Please try searching with another keyword or adjust the min outlay pricing slider values.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 font-mono text-[10px] tracking-wider text-slate-500 uppercase">
                  <th className="px-5 py-3 font-semibold">Invoice No</th>
                  <th className="px-5 py-3 font-semibold">Client Name</th>
                  <th className="px-5 py-3 font-semibold">Vehicle Code</th>
                  <th className="px-5 py-3 font-semibold">Challans Count</th>
                  <th className="px-5 py-3 font-semibold">Discount</th>
                  <th className="px-5 py-3 font-semibold text-right">Outlay Payable</th>
                  <th className="px-5 py-3 font-semibold text-center w-16">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.map((inv) => (
                  <tr 
                    key={inv.id}
                    onClick={() => onViewInvoice(inv)}
                    className="text-xs text-slate-700 hover:bg-slate-50/70 transition-colors cursor-pointer group"
                  >
                    {/* Invoice ID / Sequence details */}
                    <td className="px-5 py-3.5 font-mono">
                      <div className="flex items-center space-x-2">
                        <span className="p-1 bg-slate-100 text-slate-700 rounded transition-colors group-hover:bg-blue-600 group-hover:text-white">
                          <FileText size={12} />
                        </span>
                        <span className="font-bold text-slate-900">{inv.id}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5 font-medium font-mono">{formatDateLabel(inv.createdAt)}</span>
                    </td>

                    {/* Customer */}
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-slate-900">{inv.customerName}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5 font-medium">{inv.mobileNumber}</div>
                    </td>

                    {/* Vehicle */}
                    <td className="px-5 py-3.5 font-mono">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-800 border border-slate-200 rounded text-[10px] font-bold tracking-wider">
                        {inv.vehicleNumber}
                      </span>
                    </td>

                    {/* Count */}
                    <td className="px-5 py-3.5 font-mono font-medium text-slate-500 text-center sm:text-left">
                      {inv.challans.length} items
                    </td>

                    {/* Discount (Red highlighted aggregate where appropriate) */}
                    <td className="px-5 py-3.5 font-mono">
                      {inv.offerPercentage > 0 ? (
                        <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          -{inv.offerPercentage}% Off
                        </span>
                      ) : (
                        <span className="text-slate-400">None</span>
                      )}
                    </td>

                    {/* Final value */}
                    <td className="px-5 py-3.5 text-right font-mono font-bold text-slate-950">
                      ₹{inv.finalAmount.toLocaleString("en-IN")}
                    </td>

                    {/* Operations delete/view */}
                    <td className="px-5 py-3.5 text-center">
                      <div className="flex items-center justify-center space-x-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={(e) => handleDeleteConfirm(inv.id, e)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                          title="Erase transaction deed"
                        >
                          <Trash2 size={13} />
                        </button>
                        <span className="text-slate-300">
                          <ChevronRight size={14} />
                        </span>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
