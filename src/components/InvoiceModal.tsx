import React, { useRef } from "react";
import { Invoice } from "../types";
import { X, Printer, Receipt, Calendar, User, Phone, Car, Scale, ShieldAlert } from "lucide-react";
import CompanyLogo from "./CompanyLogo";

interface InvoiceModalProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function InvoiceModal({ invoice, isOpen, onClose }: InvoiceModalProps) {
  if (!invoice || !isOpen) return null;

  const printAreaRef = useRef<HTMLDivElement>(null);

  const handlePrint = (e: React.MouseEvent) => {
    e.preventDefault();
    // In our react index.css we configured `.print-only` and `.print:hidden`.
    // We just trigger the normal window.print()!
    window.print();
  };

  // Safe formatting helpers
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return dateStr;
    }
  };

  // Discount value
  const discountAmount = invoice.settlementAmount - invoice.discountedAmount;

  return (
    <>
      {/* SCREEN MODAL VIEW (HIDDEN DURING PRINT) */}
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 print:hidden animate-fade-in">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col border border-slate-200">
          
          {/* Header toolbar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50 sticky top-0 rounded-t-xl z-10">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 bg-blue-600 text-white rounded-md">
                <Receipt size={18} />
              </span>
              <h3 className="font-display font-semibold text-slate-900 text-lg">
                Invoice Settlement Detail
              </h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-blue-50 text-blue-800 font-semibold border border-blue-150">
                {invoice.id}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrint}
                className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all focus:ring-2 focus:ring-blue-400 cursor-pointer shadow-sm"
              >
                <Printer size={16} />
                <span>Print / Save as PDF</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
                title="Close modal"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Core modal invoice sheet */}
          <div className="p-8 md:p-12 overflow-y-auto bg-slate-50/50">
            
            {/* Elegant physical paper card style replicating printed outcome */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 md:p-10 shadow-sm max-w-3xl mx-auto">
              
              {/* Invoice Brand Header */}
              <div className="flex flex-col md:flex-row justify-between items-start pb-8 border-b border-slate-200 gap-4">
                <div className="flex flex-col items-start">
                  <CompanyLogo className="h-14 w-auto self-start" showText={true} />
                  <p className="text-[11px] font-medium text-slate-705 mt-2 font-mono">
                    Liaisons & Fine Settlements Clearances
                  </p>
                  <p className="text-[10px] text-slate-500 font-sans tracking-wide mt-1.5 leading-relaxed">
                    B-2/24 Sector-17, First floor, Sec-15 Rohini, New Delhi<br />
                    Phone: 9990314663 | Email: lawyergo.in@gmail.com
                  </p>
                </div>
                
                <div className="text-left md:text-right font-sans text-xs text-slate-500 self-stretch flex flex-col justify-between">
                  <div>
                    <div className="font-mono text-slate-900 font-bold text-sm tracking-wide uppercase">
                      ORIGINAL BILLING INVOICE
                    </div>
                    <div className="mt-1">Invoice Ref: <span className="font-mono text-slate-900 font-bold">{invoice.id}</span></div>
                    <div>Issued Date: {formatDate(invoice.createdAt)}</div>
                  </div>
                  <div className="text-[9.5px] text-slate-400 font-mono tracking-wider uppercase mt-4">
                    Licensed Delhi Jurisdiction Liaison Agent
                  </div>
                </div>
              </div>

              {/* Customer and vehicle profiles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-b border-indigo-50/40 bg-slate-50/30 -mx-6 px-6 my-2 rounded-md">
                
                <div>
                  <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold mb-2">
                    CLIENT REGISTRATION INFO
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <User size={14} className="text-slate-400 shrink-0" />
                      <span className="font-semibold text-slate-800">{invoice.customerName}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone size={14} className="text-slate-400 shrink-0" />
                      <span className="text-slate-600 font-mono">{invoice.mobileNumber}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold mb-2">
                    CLEARED VEHICLE DETAILS
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <Car size={14} className="text-slate-400 shrink-0" />
                      <span className="font-mono font-bold tracking-wider px-2 py-0.5 bg-slate-100 text-slate-900 border border-slate-200 rounded text-xs select-all">
                        {invoice.vehicleNumber}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-slate-500">
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>Authorized Legal Settlement Active</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Challans Table */}
              <div className="py-6">
                <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold mb-3">
                  COMPREHENSIVE CHALLAN CLEARANCE SCHEDULE ({invoice.challans.length} ITEMS)
                </div>
                
                <div className="overflow-x-auto border border-slate-150 rounded-lg">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                        <th className="px-4 py-3">#</th>
                        <th className="px-4 py-3">Challan No.</th>
                        <th className="px-4 py-3">Challan Date</th>
                        <th className="px-4 py-3">Violation Details</th>
                        <th className="px-4 py-3 text-right">Raw Fine (INR)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {invoice.challans.map((challan, i) => (
                        <tr key={challan.id || i} className="text-xs text-slate-700 hover:bg-slate-50/50">
                          <td className="px-4 py-2.5 font-mono text-slate-400">{i + 1}</td>
                          <td className="px-4 py-2.5 font-mono text-slate-900 font-medium">{challan.challanNumber}</td>
                          <td className="px-4 py-2.5 font-mono text-slate-500">{challan.challanDate}</td>
                          <td className="px-4 py-2.5 text-slate-800 font-medium">{challan.violation}</td>
                          <td className="px-4 py-2.5 text-right font-mono text-slate-900 font-semibold">
                            ₹{challan.amount.toLocaleString("en-IN")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Price Calculation Breakdowns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                <div className="text-xs text-slate-400 italic flex items-end">
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 w-full">
                    <div className="flex items-center space-x-1.5 text-slate-600 font-medium mb-1">
                      <Scale size={14} className="text-amber-500" />
                      <span>Legal Clearing Agency Note</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-500">
                      We herewith declare that under Legal Settlement terms, listed traffic/transport citations are marked settled. This service facilitates compound payment processing directly via legal counsels.
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-slate-700 md:pl-6 bg-slate-50/40 p-4 rounded-lg border border-slate-50">
                  <div className="flex justify-between items-center text-xs">
                    <span>Base Fine Subtotal:</span>
                    <span className="font-mono text-slate-900">₹{invoice.settlementAmount.toLocaleString("en-IN")}</span>
                  </div>
                  
                  {invoice.offerPercentage > 0 && (
                    <div className="flex justify-between items-center text-xs text-red-600">
                      <div className="flex items-center space-x-1">
                        <span>Settlement Discount ({invoice.offerPercentage}%):</span>
                      </div>
                      <span className="font-mono font-medium">- ₹{discountAmount.toLocaleString("en-IN")}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-xs border-b border-dashed border-slate-200 pb-2">
                    <span className="text-slate-500">Subtotal after Settlement:</span>
                    <span className="font-mono text-slate-800 font-semibold">₹{invoice.discountedAmount.toLocaleString("en-IN")}</span>
                  </div>

                  {invoice.showLegalFee && (
                    <div className="flex justify-between items-center text-xs">
                      <span>Legal Professional Advisory Fee:</span>
                      <span className="font-mono text-slate-900">₹{invoice.legalFee.toLocaleString("en-IN")}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2 text-base font-bold text-slate-900 border-t border-slate-250">
                    <span className="font-display font-medium text-sm tracking-tight">TOTAL PAYABLE AMOUNT:</span>
                    <span className="font-mono text-slate-950 font-bold">₹{invoice.finalAmount.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Stamp or Signatures */}
              <div className="mt-8 pt-8 border-t border-slate-200 grid grid-cols-2 gap-4 text-center">
                <div className="flex flex-col items-center justify-center">
                  <div className="h-10 w-24 border-b border-slate-300 font-sans italic text-xs text-slate-400 pt-5">
                    LawyerGo Unit Code
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono uppercase mt-2">Authorized Assessor Signature</span>
                </div>

                <div className="flex flex-col items-center justify-center">
                  <div className="h-10 w-24 border-b border-slate-300 font-sans font-semibold text-slate-800 flex items-end justify-center pb-1 text-xs">
                    PAID / CLEARED
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono uppercase mt-2">Legal Adjudicator Approval Stamp</span>
                </div>
              </div>

            </div>

          </div>

          {/* Footer toolbar */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-xl flex justify-between items-center text-xs text-slate-400">
            <div>
              Generated via LawyerGo desktop cloud sync. Database verified and locked.
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition-colors cursor-pointer"
            >
              Close Document
            </button>
          </div>

        </div>
      </div>

      {/* PRINT-ONLY CONTAINER (DISPLAYED EXCLUSIVELY VIA @MEDIA PRINT TO CREATE NATIVE HIGH-RES PDF VECTOR DOCUMENTS) */}
      <div className="print-only">
        
        {/* Invoice Brand Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid #000000", paddingBottom: "16px", marginBottom: "16px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
              <CompanyLogo className="h-12 w-auto" showText={true} />
            </div>
            <p style={{ margin: "4px 0", fontSize: "10.5px", fontWeight: "600", color: "#1e293b", fontFamily: "sans-serif" }}>
              B-2/24 Sector-17, First floor, Sec-15 Rohini, New Delhi
            </p>
            <p style={{ margin: "2px 0 0 0", fontSize: "10px", color: "#475569", fontFamily: "monospace" }}>
              Phone: 9990314663 | Email: lawyergo.in@gmail.com
            </p>
          </div>
          <div style={{ textAlign: "right", fontSize: "11px", lineHeight: "1.4" }}>
            <h2 style={{ fontSize: "14px", margin: 0, fontWeight: "bold", color: "#000000" }}>ORIGINAL INVOICE / CLEARANCE BILL</h2>
            <div style={{ marginTop: "4px" }}><strong>Invoice ID:</strong> <span style={{ fontFamily: "monospace" }}>{invoice.id}</span></div>
            <div><strong>Issue Date:</strong> {formatDate(invoice.createdAt)}</div>
            <div><strong>Office Jurisdiction:</strong> Delhi Transport Authority Liaison</div>
          </div>
        </div>

        {/* Client & Vessel registration */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", margin: "20px 0", padding: "12px", border: "1px solid #ddd", borderRadius: "4px", backgroundColor: "#f9f9f9" }}>
          <div>
            <div style={{ fontSize: "9px", color: "#666", fontWeight: "bold", marginBottom: "4px", textTransform: "uppercase" }}>COMMERCIAL ACCOUNT HOLDER</div>
            <div style={{ fontWeight: "bold", fontSize: "14px" }}>{invoice.customerName}</div>
            <div style={{ fontSize: "12px", marginTop: "2px" }}>Mobile Tag: {invoice.mobileNumber}</div>
          </div>
          <div>
            <div style={{ fontSize: "9px", color: "#666", fontWeight: "bold", marginBottom: "4px", textTransform: "uppercase" }}>CLEARED VEHICLE DETAILS</div>
            <div style={{ fontFamily: "monospace", fontSize: "14px", fontWeight: "bold" }}>{invoice.vehicleNumber}</div>
            <div style={{ fontSize: "11px", color: "#22c55e", marginTop: "2.5px" }}>✓ System Citation Record Cleared</div>
          </div>
        </div>

        {/* Challans Scheduled Details */}
        <div style={{ margin: "24px 0" }}>
          <div style={{ fontSize: "10px", fontWeight: "bold", borderBottom: "1px solid #000", paddingBottom: "6px", marginBottom: "10px" }}>
            TRAFFIC COMPROMISED CHALLANS DETAILS
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f0f0f0", textAlign: "left" }}>
                <th style={{ padding: "8px", border: "1px solid #ccc" }}>S.No</th>
                <th style={{ padding: "8px", border: "1px solid #ccc" }}>Challan Reference</th>
                <th style={{ padding: "8px", border: "1px solid #ccc" }}>Violation Violation Type</th>
                <th style={{ padding: "8px", border: "1px solid #ccc" }}>Record Date</th>
                <th style={{ padding: "8px", border: "1px solid #ccc", textAlign: "right" }}>Raw Amount (INR)</th>
              </tr>
            </thead>
            <tbody>
              {invoice.challans.map((challan, idx) => (
                <tr key={challan.id || idx}>
                  <td style={{ padding: "8px", border: "1px solid #eee", fontFamily: "monospace" }}>{idx + 1}</td>
                  <td style={{ padding: "8px", border: "1px solid #eee", fontFamily: "monospace", fontWeight: "bold" }}>{challan.challanNumber}</td>
                  <td style={{ padding: "8px", border: "1px solid #eee" }}>{challan.violation}</td>
                  <td style={{ padding: "8px", border: "1px solid #eee", fontFamily: "monospace" }}>{challan.challanDate}</td>
                  <td style={{ padding: "8px", border: "1px solid #eee", textAlign: "right", fontFamily: "monospace" }}>₹{challan.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Calculations bottom schedule */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: "40px", marginTop: "30px", fontSize: "12px", borderTop: "1px solid #000", paddingTop: "15px" }} className="print-avoid-break">
          <div style={{ maxWidth: "45%", fontSize: "10px", color: "#555", fontStyle: "italic" }}>
            <strong>LEGAL OFFICE DECLARATION:</strong><br />
            Traffic infringement clearances under Advocate Code Section 84 are executed on-behalf of the registered vehicle owner. All compounding discounts are legal settlements processed with municipal and state transit authorities.
          </div>
          
          <div style={{ minWidth: "250px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", margin: "4px 0" }}>
              <span>Challans Total:</span>
              <strong style={{ fontFamily: "monospace" }}>₹{invoice.settlementAmount.toFixed(2)}</strong>
            </div>
            {invoice.offerPercentage > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", margin: "4px 0", color: "#d90429" }}>
                <span>Settlement Discount ({invoice.offerPercentage}%):</span>
                <strong style={{ fontFamily: "monospace" }}>- ₹{discountAmount.toFixed(2)}</strong>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", margin: "4px 0", borderBottom: "1px dashed #777", paddingBottom: "4px" }}>
              <span>Settled Subtotal:</span>
              <strong style={{ fontFamily: "monospace" }}>₹{invoice.discountedAmount.toFixed(2)}</strong>
            </div>
            {invoice.showLegalFee && (
              <div style={{ display: "flex", justifyContent: "space-between", margin: "4px 0" }}>
                <span>Legal Professional Charge:</span>
                <strong style={{ fontFamily: "monospace" }}>₹{invoice.legalFee.toFixed(2)}</strong>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", margin: "8px 0", fontSize: "14px", fontWeight: "bold", borderTop: "1px solid #000", strokeWidth: "12px", paddingTop: "6px" }}>
              <span>NET PAYABLE FINAL:</span>
              <span style={{ fontFamily: "monospace", fontSize: "16px" }}>₹{invoice.finalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Signatures printable */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "60px", fontSize: "11px" }} className="print-avoid-break">
          <div style={{ textAlign: "center", width: "40%" }}>
            <div style={{ borderBottom: "1px solid #999", width: "180px", margin: "0 auto", height: "35px" }}></div>
            <div style={{ marginTop: "6px", textTransform: "uppercase", fontSize: "9px", color: "#666" }}>Assessor Clearance Counsel</div>
          </div>
          <div style={{ textAlign: "center", width: "40%" }}>
            <div style={{ borderBottom: "1px solid #999", width: "180px", margin: "0 auto", height: "35px", display: "flex", alignItems: "end", justifyContent: "center", fontStyle: "italic", fontWeight: "bold" }}>PAID AND CLEARED</div>
            <div style={{ marginTop: "6px", textTransform: "uppercase", fontSize: "9px", color: "#666" }}>LawyerGo Official Adjudication stamp</div>
          </div>
        </div>

      </div>
    </>
  );
}
