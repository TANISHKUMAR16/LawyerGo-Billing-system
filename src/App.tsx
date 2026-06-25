import React, { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard";
import InvoiceCreator from "./components/InvoiceCreator";
import HistoryList from "./components/HistoryList";
import InvoiceModal from "./components/InvoiceModal";
import CompanyLogo from "./components/CompanyLogo";
import { Invoice, DashboardStats } from "./types";
import { 
  Scale, 
  LayoutDashboard, 
  FileText, 
  History, 
  HelpCircle,
  FileCheck,
  CheckCircle,
  Clock,
  Sparkles,
  RefreshCw,
  MapPin,
  FileBadge
} from "lucide-react";

export default function App() {
  // Navigation: "dashboard" | "create" | "history" | "help"
  const [activeTab, setActiveTab] = useState<"dashboard" | "create" | "history" | "help">("dashboard");

  // Invoices and Stats states
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Selected invoice for the detail printable Modal
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Custom persistent toast notification system
  const [notification, setNotification] = useState<{ message: string; type: "success" | "info" } | null>(null);

  // Fetch all invoices and stats from Express APIs
  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // Fetch stats
      const statsRes = await fetch("/api/stats");
      const statsData = await statsRes.json();
      setStats(statsData);

      // Fetch list
      const listRes = await fetch("/api/invoices");
      const listData = await listRes.json();
      setInvoices(listData);

    } catch (e) {
      console.error("Error synchronizing with local SQLite proxy:", e);
      showToast("Verification sync connection failed", "info");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Display clean custom overlay Toast
  const showToast = (msg: string, type: "success" | "info" = "success") => {
    setNotification({ message: msg, type });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // Callback when a new invoice is generated
  const handleInvoiceCreated = (newInvoice: Invoice) => {
    // Show toast
    showToast(`Invoice ${newInvoice.id} generated and logged in database!`, "success");
    
    // Auto sync state & data
    fetchAllData();
    
    // Automatically trigger visual overlay printed Modal of the new invoice!
    setSelectedInvoice(newInvoice);
    setIsModalOpen(true);
    
    // Shift tab back to dashboard or stay (let's shift to history view for clear status log!)
    setActiveTab("history");
  };

  // Callback to execute deletion of invoice from persistent storage
  const handleDeleteInvoice = async (invoiceId: string) => {
    try {
      const res = await fetch(`/api/invoices/${invoiceId}`, {
        method: "DELETE"
      });

      if (!res.ok) {
        throw new Error("Failed deleting ledger reference");
      }

      showToast(`Record ${invoiceId} successfully purged from database.`, "info");
      
      // Reload server data
      fetchAllData();

    } catch (e) {
      console.error(e);
      showToast("Purple SQL-delete request failed", "info");
    }
  };

  // Trigger inspect modal of a specific invoice
  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col md:flex-row print:bg-white print:p-0 font-sans">
      
      {/* DESKTOP SIDEBAR (HIDDEN ON MOBILE & PRINT) */}
      <aside className="hidden md:flex w-64 bg-[#1e293b] text-white flex-col border-r border-slate-200 shrink-0 print:hidden sticky top-0 h-screen">
        <div className="p-5 border-b border-slate-800 bg-slate-900/30 flex justify-center items-center">
          <CompanyLogo className="h-14 w-auto" showText={true} textColor="light" />
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              activeTab === "dashboard"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab("create")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              activeTab === "create"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <FileCheck size={18} />
            <span>New Invoice</span>
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              activeTab === "history"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <History size={18} />
            <span>Invoice Logs</span>
          </button>

          <button
            onClick={() => setActiveTab("help")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              activeTab === "help"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <HelpCircle size={18} />
            <span>Legal Help</span>
          </button>
        </nav>

        {/* BOTTOM BRAND CONTACT CARD */}
        <div className="p-5 border-t border-slate-700 mt-auto text-xs text-slate-400 bg-slate-900/30">
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold mb-1.5">Official Liaison</p>
          <p className="text-slate-200 font-semibold mb-0.5">LawyerGo Legal</p>
          <p className="text-[11px] leading-relaxed text-slate-400 mb-2">B-2/24 Sector-17, 1st Floor,<br/>Sec-15, Rohini, New Delhi</p>
          <div className="space-y-1 font-mono text-[10px] text-slate-300">
            <p className="flex items-center gap-1.5">
              <span>📞</span> +91 99903 14663
            </p>
            <p className="flex items-center gap-1.5 truncate" title="lawyergo.in@gmail.com">
              <span>✉️</span> lawyergo.in@gmail.com
            </p>
          </div>
        </div>
      </aside>

      {/* MOBILE RESPONSIVE HEADER BAR (HIDDEN ON DESKTOP & PRINT) */}
      <header className="md:hidden bg-[#1e293b] text-white p-3 flex justify-between items-center print:hidden sticky top-0 z-40 shadow-md">
        <div className="flex items-center">
          <CompanyLogo className="h-10 w-auto" showText={true} textColor="light" />
        </div>
        <nav className="flex space-x-1">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`p-2 rounded-lg text-xs transition-colors ${activeTab === "dashboard" ? "bg-blue-600 text-white" : "text-slate-350"}`}
            title="Dashboard"
          >
            <LayoutDashboard size={15} />
          </button>
          <button
            onClick={() => setActiveTab("create")}
            className={`p-2 rounded-lg text-xs transition-colors ${activeTab === "create" ? "bg-blue-600 text-white" : "text-slate-350"}`}
            title="New Invoice"
          >
            <FileCheck size={15} />
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`p-2 rounded-lg text-xs transition-colors ${activeTab === "history" ? "bg-blue-600 text-white" : "text-slate-350"}`}
            title="Logs"
          >
            <History size={15} />
          </button>
          <button
            onClick={() => setActiveTab("help")}
            className={`p-2 rounded-lg text-xs transition-colors ${activeTab === "help" ? "bg-blue-600 text-white" : "text-slate-350"}`}
            title="Help"
          >
            <HelpCircle size={15} />
          </button>
        </nav>
      </header>

      {/* RIGHT SIDE CONTENT CONTAINER AREA */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#f8fafc]">
        
        {/* COMPACT WORKSPACE HEADER - PRINT HIDDEN */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-8 print:hidden shrink-0">
          <h1 className="text-md font-semibold text-slate-900 tracking-tight font-display capitalize">
            {activeTab === "dashboard" && "Dashboard Overview"}
            {activeTab === "create" && "New Settlement Draft"}
            {activeTab === "history" && "Settlement History Logs"}
            {activeTab === "help" && "AdvisoryCompliance System"}
          </h1>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center space-x-2 text-[10.5px] bg-[#f1f5f9] px-3 py-1.5 rounded-lg text-slate-600 font-mono border border-slate-200/80">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              </span>
              <span>DB SYNC ACTIVE</span>
            </div>

            {activeTab !== "create" && (
              <button 
                onClick={() => setActiveTab("create")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer"
              >
                + Create Invoice
              </button>
            )}
          </div>
        </header>

        {/* TOAST SYSTEM (Alert popup overlay) */}
        {notification && (
          <div className="fixed bottom-6 right-6 z-50 print:hidden animate-fade-in max-w-sm">
            <div className={`p-4 rounded-xl shadow-lg border flex items-start gap-3 ${
              notification.type === "success" 
              ? "bg-slate-900 border-slate-850 text-slate-100" 
              : "bg-red-50 border-red-200 text-red-800"
            }`}>
              <CheckCircle size={18} className="text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-sans font-medium">{notification.message}</p>
              </div>
            </div>
          </div>
        )}

        {/* CORE WORKSPACE PORTAL */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 print:hidden">
          
          {loading && (
            <div className="flex flex-col items-center justify-center h-[50vh] space-y-3">
              <RefreshCw size={24} className="animate-spin text-blue-600" />
              <p className="text-xs text-slate-500 font-mono">Restoring database pipelines...</p>
            </div>
          )}

          {!loading && (
            <>
              {activeTab === "dashboard" && (
                <Dashboard 
                  stats={stats} 
                  onNavigateToCreate={() => setActiveTab("create")} 
                  onViewInvoice={handleViewInvoice}
                />
              )}

              {activeTab === "create" && (
                <InvoiceCreator onInvoiceCreated={handleInvoiceCreated} />
              )}

              {activeTab === "history" && (
                <HistoryList 
                  invoices={invoices} 
                  onViewInvoice={handleViewInvoice} 
                  onDeleteInvoice={handleDeleteInvoice} 
                />
              )}

              {activeTab === "help" && (
                <div className="bg-white p-8 rounded-xl border border-slate-200 max-w-3xl mx-auto space-y-6 shadow-xs">
                  <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
                    <div className="h-10 w-10 text-blue-600 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Scale size={20} />
                    </div>
                    <div>
                      <h2 className="font-display font-bold text-slate-900 text-xl">Legal Advisories & User Manual</h2>
                      <p className="text-xs text-slate-400">LawyerGo Legal Settlement Office compliance metrics</p>
                    </div>
                  </div>

                  <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
                    <p>
                      LawyerGo Billing System is designed specifically for transport operators, fleet logistics firms, and corporate legal entities to settle dynamic traffic and route citation challans under legal advisory representation.
                    </p>

                    <h3 className="font-bold text-slate-900 font-display text-base pt-2">How Calculations Work</h3>
                    <ul className="list-disc pl-5 space-y-1.5 text-xs">
                      <li><b>Gross Subtotal:</b> Represents the raw cumulative face value fines recorded on municipal systems.</li>
                      <li><b>Red Discounts display:</b> Represents negotiated compromise compound benefits (0% to 75% max margin allowed natively). Highlighted directly in red as discount to retain clients' interest.</li>
                      <li><b>Legal Professional Fee:</b> The fixed service retainer fee of the assigned counsel, which may be selectively shown or hidden on the printed original invoices according to account manager controls.</li>
                      <li><b>Final Amount:</b> Computed strictly via <code className="font-mono bg-slate-105 px-1 py-0.5 rounded text-slate-800 font-bold">((Subtotal * (1 - Discount)) + LegalFee (if visible))</code>.</li>
                    </ul>

                    <h3 className="font-bold text-slate-900 font-display text-base pt-2">Vector PDF & Laser Printing</h3>
                    <p className="text-xs">
                      This browser workspace produces native vector layouts. When you click "Print / Save as PDF", standard CSS page parameters are output directly to your device printer, rendering <b>perfect high-resolution digital vector PDFs</b> or standard paper invoices. We recommend selecting "Save as PDF" and disabling headers/footers in your browser print options for a custom, clean result.
                    </p>

                    <div className="bg-blue-50/50 p-4 border border-blue-150 rounded-lg text-xs flex items-start gap-2 text-slate-700">
                      <FileBadge size={16} className="text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>System compliance note:</strong> Original invoice number formats in database (LG-YYYYMMDD-001) are sequentially governed by central clocks and double-checked of serial locks. Handheld modification is restricted to retain ledger credibility.
                      </div>
                    </div>

                    {/* Official Corporate Contact Card */}
                    <div className="bg-[#f8fafc] border border-slate-200 rounded-xl p-5 mt-6 grid grid-cols-1 md:grid-cols-3 gap-5 text-slate-700">
                      <div>
                        <h4 className="text-[11px] font-mono font-bold uppercase text-slate-400 tracking-wider mb-2">CORPORATE HEADQUARTERS</h4>
                        <p className="text-xs leading-relaxed text-slate-600 font-medium">
                          B-2/24 Sector-17, First floor<br />
                          Sec-15 Rohini, New Delhi<br />
                          Delhi - 110089, India
                        </p>
                      </div>
                      <div>
                        <h4 className="text-[11px] font-mono font-bold uppercase text-slate-400 tracking-wider mb-2">HELP LINE</h4>
                        <p className="text-xs text-slate-800 font-mono font-bold">
                          9990314663
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1">Available 9:00 AM - 6:00 PM (IST) for instant counsel lookup.</p>
                      </div>
                      <div>
                        <h4 className="text-[11px] font-mono font-bold uppercase text-slate-400 tracking-wider mb-2">EMAIL CONTACT</h4>
                        <p className="text-xs text-slate-800 font-mono font-bold truncate" title="lawyergo.in@gmail.com">
                          lawyergo.in@gmail.com
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1">Direct escalation queue managed by certified legal clearance assessors.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

        </main>

        {/* BOTTOM STATIC FOOTER */}
        <footer className="bg-slate-900 border-t border-slate-800 py-6 text-center text-[11px] text-slate-450 print:hidden font-mono mt-auto">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3 text-slate-400">
            <div className="text-left md:text-left space-y-1">
              <p className="font-semibold text-slate-300">© 2026 LawyerGo Billing System Inc.</p>
              <p className="text-[10px] text-slate-500">
                Liaison HQ: B-2/24 Sector-17, First floor, Sec-15 Rohini, New Delhi | Hotline: 9990314663 | lawyergo.in@gmail.com
              </p>
            </div>
            <div className="flex items-center space-x-2 text-[10px] text-slate-500 bg-slate-850 px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>SQL Cloud Live Sync Active</span>
            </div>
          </div>
        </footer>

      </div>

      {/* MODAL WINDOWS PROFILES */}
      <InvoiceModal 
        invoice={selectedInvoice} 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setSelectedInvoice(null); }} 
      />

    </div>
  );
}
