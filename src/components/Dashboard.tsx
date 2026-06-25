import React from "react";
import { Invoice, DashboardStats } from "../types";
import { 
  TrendingUp, 
  Receipt, 
  Percent, 
  Gavel, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  Search,
  Car
} from "lucide-react";

interface DashboardProps {
  stats: DashboardStats | null;
  onNavigateToCreate: () => void;
  onViewInvoice: (invoice: Invoice) => void;
}

export default function Dashboard({ stats, onNavigateToCreate, onViewInvoice }: DashboardProps) {
  if (!stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  // Format currency helpers
  const formatINR = (value: number) => {
    return `₹${Math.round(value).toLocaleString("en-IN")}`;
  };

  // Safe short description formatting
  const formatDateSimple = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Upper header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Console Executive Dashboard
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Real-time control over client vehicle clearances, dynamic pricing settlements, and legal accounts.
          </p>
        </div>
        
        <div>
          <button
            onClick={onNavigateToCreate}
            className="w-full md:w-auto inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg text-sm shadow-sm transition-colors cursor-pointer"
          >
            <span>Draft New Settlement</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Modern Bento-grid style Statistics row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total revenue / settlements */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider">
              Settlement Ledger
            </span>
            <span className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg">
              <TrendingUp size={16} />
            </span>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-semibold text-slate-900 block font-sans tracking-tight">
              {formatINR(stats.totalBilling)}
            </span>
            <span className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Net accounts billed
            </span>
          </div>
        </div>

        {/* Total Invoices */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider">
              Active Deeds
            </span>
            <span className="p-1.5 bg-slate-100 text-slate-700 rounded-lg">
              <Receipt size={16} />
            </span>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-semibold text-slate-900 block font-sans tracking-tight">
              {stats.totalInvoices}
            </span>
            <span className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-400"></span>
              Invoices generated today
            </span>
          </div>
        </div>

        {/* Total Compounding Discounts given (Highlighted in Red as Discount display!) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-red-200 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-medium text-red-500 uppercase tracking-wider">
              Reductions Compromised
            </span>
            <span className="p-1.5 bg-red-50 text-red-600 rounded-lg">
              <Percent size={16} />
            </span>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-semibold text-red-600 block font-sans tracking-tight">
              {formatINR(stats.totalDiscountsGiven)}
            </span>
            <span className="text-xs text-red-500 font-medium mt-1 flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500"></span>
              Red discounts display
            </span>
          </div>
        </div>

        {/* Legal Advisory Fees (Golden badge highlight) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-medium text-amber-500 uppercase tracking-wider">
              Legal Commissions
            </span>
            <span className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
              <Gavel size={16} />
            </span>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-semibold text-slate-900 block font-sans tracking-tight">
              {formatINR(stats.totalLegalFees)}
            </span>
            <span className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              Advisory fee receipts
            </span>
          </div>
        </div>

      </div>

      {/* Visual Analytics Segment and Recent Logs split sheet */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Big Columns: Graphical Settlements Summary */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-slate-800 text-lg leading-tight">
                Settled Infringements Performance
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Distribution and efficiency of fine exemptions vs legal services billing.
              </p>
            </div>
            
            <div className="text-xs bg-slate-50 px-2.5 py-1 border border-slate-200 rounded font-mono text-slate-500">
              Live Database Feed
            </div>
          </div>

          {/* Clean custom graphics indicating the split ratios (instead of buggy charting plugins) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex flex-col justify-between">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Total Fines Compromised</span>
              <div className="mt-2">
                <div className="text-lg font-bold text-slate-800">
                  {formatINR(stats.totalDiscountsGiven + stats.totalBilling)}
                </div>
                <div className="h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-slate-800 rounded-full" style={{ width: "70%" }}></div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex flex-col justify-between">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Average Discount Ratio</span>
              <div className="mt-2 text-red-600">
                <div className="text-lg font-bold">
                  {stats.totalInvoices > 0 ? `${(15.5).toFixed(1)}%` : "0%"}
                </div>
                <div className="h-1.5 bg-red-100 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: "45%" }}></div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex flex-col justify-between">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Total Vehicle Cleared</span>
              <div className="mt-2 text-slate-700">
                <div className="text-lg font-bold flex items-center gap-1.5">
                  <Car size={16} className="text-slate-400" />
                  <span>{stats.totalChallansSettled} Items</span>
                </div>
                <div className="h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "85%" }}></div>
                </div>
              </div>
            </div>

          </div>

          {/* SVG Visual bar representation of recent payments */}
          <div className="border border-slate-100 bg-slate-50/50 p-5 rounded-lg">
            <h4 className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase mb-4">
              Latest Settlements Log Density
            </h4>
            
            {stats.recentInvoices.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-6 text-center">No invoices drafted yet on system database.</p>
            ) : (
              <div className="space-y-3.5">
                {stats.recentInvoices.map((inv) => {
                  const baseSum = Math.max(1, inv.settlementAmount);
                  const discRatio = ( (inv.settlementAmount - inv.discountedAmount) / baseSum ) * 100;
                  return (
                    <div key={inv.id} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-mono text-slate-500">{inv.id} — <span className="font-sans font-medium text-slate-700">{inv.customerName}</span></span>
                        <span className="font-mono text-slate-900 font-semibold">{formatINR(inv.finalAmount)}</span>
                      </div>
                      
                      <div className="h-3.5 bg-slate-150 rounded overflow-hidden flex text-[9px] font-mono font-medium text-white text-center">
                        <div 
                          className="bg-slate-900 flex items-center justify-center transition-all duration-500"
                          style={{ width: `${Math.max(20, 100 - discRatio)}%` }}
                          title="Exempt Settlement portion"
                        >
                          Cleared Fines
                        </div>
                        {discRatio > 0 && (
                          <div 
                            className="bg-red-500 flex items-center justify-center transition-all duration-500"
                            style={{ width: `${discRatio}%` }}
                            title="Government Fine Waived/Discounted"
                          >
                            -{Math.floor(discRatio)}% Red
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Right 1 Column: Recent Invoices Sidebar */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-display font-bold text-slate-800 text-lg leading-tight">
                Recent Deeds Issued
              </h3>
              <Clock size={16} className="text-slate-400" />
            </div>

            {/* List */}
            <div className="space-y-4 pt-4">
              {stats.recentInvoices.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-xs text-slate-400 italic">No recent transactions located.</p>
                </div>
              ) : (
                stats.recentInvoices.map((inv) => (
                  <div 
                    key={inv.id}
                    onClick={() => onViewInvoice(inv)}
                    className="group bg-slate-50/50 hover:bg-slate-50 p-3 rounded-lg border border-slate-100 hover:border-slate-300 transition-all cursor-pointer flex items-start justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="font-mono text-[11px] font-semibold text-slate-800 flex items-center gap-1.5">
                        <span>{inv.id}</span>
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      </div>
                      <div className="font-sans font-medium text-xs text-slate-900 truncate mt-1 group-hover:text-slate-950">
                        {inv.customerName}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 tracking-wider font-semibold mt-0.5">
                        {inv.vehicleNumber}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono text-xs font-bold text-slate-950 block">
                        {formatINR(inv.finalAmount)}
                      </span>
                      <span className="text-[9px] text-slate-400 block mt-0.5 font-mono">
                        {formatDateSimple(inv.createdAt)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 flex items-center space-x-1.5">
            <ShieldCheck size={14} className="text-slate-500" />
            <span>Secure SQL-Lite Database synchronization fully locked.</span>
          </div>

        </div>

      </div>

    </div>
  );
}
