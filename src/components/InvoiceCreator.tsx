import React, { useState, useEffect } from "react";
import { Invoice, ChallanItem } from "../types";
import { 
  Plus, 
  Trash2, 
  User, 
  Phone, 
  Car, 
  Percent, 
  Gavel, 
  FileCheck, 
  AlertCircle,
  ToggleLeft,
  ChevronRight,
  Sparkles,
  RefreshCw,
  HeartCrack
} from "lucide-react";

interface InvoiceCreatorProps {
  onInvoiceCreated: (newInvoice: Invoice) => void;
}

export default function InvoiceCreator({ onInvoiceCreated }: InvoiceCreatorProps) {
  // Customer details state
  const [customerName, setCustomerName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [offerPercentage, setOfferPercentage] = useState<number>(15); // Default 15% offer
  const [legalFee, setLegalFee] = useState<number>(1500); // Default 1500 legal fee
  const [showLegalFee, setShowLegalFee] = useState(true);

  // Next invoice number preview
  const [nextInvoiceNo, setNextInvoiceNo] = useState("Loading...");

  // Challans state
  const [challans, setChallans] = useState<ChallanItem[]>([
    {
      id: "c-initial-1",
      challanNumber: "MHP-1284920",
      challanDate: new Date().toISOString().substring(0, 10),
      violation: "Over Speeded (Camera)",
      amount: 2000
    }
  ]);

  // Temp state for adding a single challan
  const [tempChallanNo, setTempChallanNo] = useState("");
  const [tempChallanDate, setTempChallanDate] = useState(new Date().toISOString().substring(0, 10));
  const [tempViolation, setTempViolation] = useState("No Helmet");
  const [tempAmount, setTempAmount] = useState<number>(500);
  const [customViolation, setCustomViolation] = useState("");
  const [useCustomViolation, setUseCustomViolation] = useState(false);

  // Form error notification
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Presets of Violation categories for quick selection
  const violationPresets = [
    { name: "No Helmet", fee: 500 },
    { name: "Over Speeded (Camera)", fee: 2000 },
    { name: "Red Light Jump", fee: 1000 },
    { name: "No Seat Belt", fee: 1000 },
    { name: "Wrong Parking Violation", fee: 500 },
    { name: "Dangerous Driving Clearance", fee: 5000 },
    { name: "Drunken Driving Penalty", fee: 10000 },
    { name: "No PUC / Air Emission Certificate", fee: 2000 }
  ];

  // Fetch sequential next invoice no preview
  const fetchNextInvoiceNumber = async () => {
    try {
      const res = await fetch("/api/next-invoice-number");
      const data = await res.json();
      if (data && data.nextInvoiceNo) {
        setNextInvoiceNo(data.nextInvoiceNo);
      }
    } catch (e) {
      console.error("Error fetching preview sequence:", e);
      setNextInvoiceNo("LG-202606_...");
    }
  };

  useEffect(() => {
    fetchNextInvoiceNumber();
  }, []);

  // Update temp amount when violation preset selection alters
  const handlePresetChange = (presetName: string) => {
    setTempViolation(presetName);
    const matched = violationPresets.find(v => v.name === presetName);
    if (matched) {
      setTempAmount(matched.fee);
    }
  };

  // Add individual challan row-item
  const handleAddChallanItem = (e: React.FormEvent) => {
    e.preventDefault();
    
    const violationText = useCustomViolation ? customViolation : tempViolation;
    if (!violationText.trim()) {
      setError("Please key-in a valid Violation reason or select a category");
      return;
    }

    const challanNo = tempChallanNo.trim() || `CH-${Math.floor(Math.random() * 10000000)}`;

    const newItem: ChallanItem = {
      id: `c-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      challanNumber: challanNo.toUpperCase(),
      challanDate: tempChallanDate,
      violation: violationText,
      amount: Number(tempAmount) || 0
    };

    setChallans([...challans, newItem]);
    
    // Reset temp inputs
    setTempChallanNo("");
    setCustomViolation("");
    setUseCustomViolation(false);
    setError("");
    
    // Focus first preset back
    if (violationPresets.length > 0) {
      setTempViolation(violationPresets[0].name);
      setTempAmount(violationPresets[0].fee);
    }
  };

  // Remove individual challan row-item
  const handleRemoveChallanItem = (idToDelete: string) => {
    if (challans.length <= 1) {
      setError("An invoice must contain at least one clear compound challan.");
      return;
    }
    setChallans(challans.filter(c => c.id !== idToDelete));
    setError("");
  };

  // Calculation parameters
  const settlementAmount = challans.reduce((sum, item) => sum + item.amount, 0);
  const discountAmount = settlementAmount * (offerPercentage / 100);
  const discountedAmount = settlementAmount - discountAmount;
  const finalAmount = discountedAmount + (showLegalFee ? legalFee : 0);

  // Submit and Save Invoice
  const handleGenerateInvoice = async () => {
    // Basic verification checks
    if (!customerName.trim()) {
      setError("Please fill in the Commercial Client or Customer Name first.");
      return;
    }
    if (!mobileNumber.trim()) {
      setError("Mobile contact number is required.");
      return;
    }
    if (mobileNumber.length < 8) {
      setError("Kindly enter a valid mobile phone parameter.");
      return;
    }
    if (!vehicleNumber.trim()) {
      setError("Vehicle registration tag (MH-XX-XX-XXXX) is required.");
      return;
    }
    if (challans.length === 0) {
      setError("Cannot clear a deed without any recorded challan items.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const submissionPayload = {
        customerName: customerName.trim(),
        mobileNumber: mobileNumber.trim(),
        vehicleNumber: vehicleNumber.trim().toUpperCase(),
        offerPercentage: Number(offerPercentage),
        legalFee: Number(legalFee),
        showLegalFee,
        challans
      };

      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(submissionPayload)
      });

      if (!res.ok) {
        throw new Error("API server rejected the registration.");
      }

      const savedInvoice = await res.json() as Invoice;
      
      // Successfully generated: trigger callback
      onInvoiceCreated(savedInvoice);

      // Clean inputs for next
      setCustomerName("");
      setMobileNumber("");
      setVehicleNumber("");
      setChallans([
        {
          id: "c-initial-2",
          challanNumber: "",
          challanDate: new Date().toISOString().substring(0, 10),
          violation: "Over Speeded (Camera)",
          amount: 2000
        }
      ]);
      fetchNextInvoiceNumber();

    } catch (e) {
      console.error(e);
      setError("Failed to register and save invoice into SQL database. Check API status.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-fade-in pb-12">
      
      {/* LEFT & CENTER COLLS (FORM & DETAILED SECTIONS) */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* SECTION 1: Client & Ownership Registry */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-display font-bold text-slate-800 text-lg">
              1. Owner Details & Registration
            </h3>
            <span className="font-mono text-xs text-slate-400 select-all font-semibold uppercase bg-slate-50 px-2.5 py-1 border border-slate-200 rounded">
              SEQ: {nextInvoiceNo}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Customer Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-505">
                Customer / Corporate Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Sharma Commercial Logistics"
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-hidden transition-all placeholder:text-slate-400 font-medium"
                />
              </div>
            </div>

            {/* Mobile Contact */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-505">
                Mobile Number
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Phone size={16} />
                </span>
                <input
                  type="text"
                  value={mobileNumber}
                  maxLength={14}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/[^0-9+]/g, ""))}
                  placeholder="e.g. 9876543210"
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-hidden transition-all placeholder:text-slate-400 font-mono font-medium"
                />
              </div>
            </div>

            {/* Vehicle Number License plate */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-505 flex justify-between items-center">
                <span>Vehicle Registration Tag</span>
                <span className="text-[10px] text-slate-400 font-normal italic">Format: State - Code - Series - Number (e.g. MH-12-PQ-8849)</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Car size={16} />
                </span>
                <input
                  type="text"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. MH-12-PQ-8849"
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm font-mono tracking-widest bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-hidden transition-all placeholder:text-slate-400 font-bold"
                />
              </div>
            </div>

          </div>
        </div>

        {/* SECTION 2: Dynamic Challan Entry Row & Table */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-display font-bold text-slate-800 text-lg">
              2. Compound Infringement Items
            </h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full font-medium bg-slate-100 border border-slate-200 text-slate-600">
              {challans.length} Rowed Fines
            </span>
          </div>

          {/* Individual Challan Creator Box */}
          <form onSubmit={handleAddChallanItem} className="bg-slate-50/40 p-4 rounded-xl border border-slate-200/60 grid grid-cols-1 md:grid-cols-12 gap-3.5 items-end">
            
            <div className="md:col-span-3 space-y-1.5">
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Challan ID / Ref
              </label>
              <input
                type="text"
                value={tempChallanNo}
                onChange={(e) => setTempChallanNo(e.target.value)}
                placeholder="e.g. MHP-449301"
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-hidden transition-colors font-medium placeholder:text-slate-300"
              />
            </div>

            <div className="md:col-span-3 space-y-1.5">
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Notice Citation Date
              </label>
              <input
                type="date"
                value={tempChallanDate}
                onChange={(e) => setTempChallanDate(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-hidden transition-colors"
                required
              />
            </div>

            <div className="md:col-span-4 space-y-1.5">
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 flex justify-between items-center">
                <span>Violation Category</span>
                <button
                  type="button"
                  onClick={() => setUseCustomViolation(!useCustomViolation)}
                  className="text-[9px] text-blue-600 hover:text-blue-700 underline font-sans cursor-pointer focus:outline-hidden"
                >
                  {useCustomViolation ? "Use preset list" : "Type custom..."}
                </button>
              </label>
              
              {useCustomViolation ? (
                <input
                  type="text"
                  value={customViolation}
                  onChange={(e) => setCustomViolation(e.target.value)}
                  placeholder="e.g. Lane Cutting Outride"
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-hidden"
                  required
                />
              ) : (
                <select
                  value={tempViolation}
                  onChange={(e) => handlePresetChange(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-hidden font-medium"
                >
                  {violationPresets.map((v) => (
                    <option key={v.name} value={v.name}>
                      {v.name} (₹{v.fee})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Amount (INR)
              </label>
              <input
                type="number"
                value={tempAmount}
                min={0}
                onChange={(e) => setTempAmount(Number(e.target.value))}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono font-bold bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-hidden"
                required
              />
            </div>

            <div className="md:col-span-12 flex justify-end">
              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-4.5 py-2 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <Plus size={14} />
                <span>Save Entry Row</span>
              </button>
            </div>

          </form>

          {/* Challans List Array */}
          <div className="border border-slate-150 rounded-lg overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-150 font-mono text-[10px] tracking-wider text-slate-500 uppercase">
                  <th className="px-4 py-2.5">Challan Ref</th>
                  <th className="px-4 py-2.5">Date</th>
                  <th className="px-4 py-2.5">Violation</th>
                  <th className="px-4 py-2.5 text-right">Amount</th>
                  <th className="px-4 py-2.5 text-center w-12">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {challans.map((c, index) => (
                  <tr key={c.id || index} className="text-xs text-slate-700 hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-mono font-semibold text-slate-900">
                      {c.challanNumber || <span className="text-slate-300 font-normal italic">Auto assigned</span>}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-500">{c.challanDate}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{c.violation}</td>
                    <td className="px-4 py-3 text-right font-mono text-slate-900 font-semibold">
                      ₹{c.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveChallanItem(c.id)}
                        className="p-1 text-slate-400 hover:text-red-500 rounded-md transition-colors cursor-pointer"
                        title="Delete violation item row"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      </div>

      {/* RIGHT SIDEBAR (SUMMARY PANEL & CALCULATOR ACTION) */}
      <div className="space-y-6">
        
        {/* SECTION 3: Financial Settlements Parameters */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-display font-bold text-slate-800 text-lg pb-3 border-b border-slate-100">
            3. Pricing Adjustments
          </h3>

          {/* Offer Percentage Selection */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 flex justify-between items-center">
              <span>Compounding Offer</span>
              <span className="text-red-600 font-semibold font-mono text-xs">{offerPercentage}% OFF</span>
            </label>
            
            {/* Offer Presets Buttons */}
            <div className="grid grid-cols-4 gap-2">
              {[0, 10, 15, 20, 25, 30, 50].slice(0, 4).map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => setOfferPercentage(rate)}
                  className={`py-1.5 rounded-lg border text-xs font-mono font-bold transition-all cursor-pointer ${
                    offerPercentage === rate 
                    ? "bg-blue-600 border-blue-600 text-white shadow-xs" 
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {rate}%
                </button>
              ))}
            </div>

            {/* Slider or more presets */}
            <div className="pt-2">
              <input
                type="range"
                min="0"
                max="75"
                step="5"
                value={offerPercentage}
                onChange={(e) => setOfferPercentage(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75% (Max Legal limit)</span>
              </div>
            </div>
          </div>

          {/* Legal Advisory Fee Entry */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between pb-1">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                Legal Advisor Commission
              </label>
              
              <div className="flex items-center space-x-1.5">
                <span className="text-[10px] text-slate-400 font-mono font-medium">Show on copy</span>
                <input
                  type="checkbox"
                  checked={showLegalFee}
                  onChange={(e) => setShowLegalFee(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 h-3.5 w-3.5 accent-blue-600"
                />
              </div>
            </div>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 font-mono text-xs font-semibold">
                ₹
              </span>
              <input
                type="number"
                value={legalFee}
                min={0}
                onChange={(e) => setLegalFee(Number(e.target.value))}
                placeholder="1500"
                className="w-full pl-7 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-hidden font-mono font-medium"
              />
            </div>
          </div>

        </div>

        {/* PRICE SUMMARY ACTION TILT */}
        <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl border border-slate-800 shadow-lg space-y-6">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="font-display font-medium text-slate-300 text-sm tracking-tight">
              Pre-authorized Billings Sheet
            </h4>
            <Sparkles size={16} className="text-amber-400" />
          </div>

          {/* Pricing breakdowns details */}
          <div className="space-y-3 text-xs">
            
            <div className="flex justify-between text-slate-400">
              <span>Government Citation Fine total:</span>
              <span className="font-mono text-slate-200">₹{settlementAmount.toLocaleString("en-IN")}</span>
            </div>

            {offerPercentage > 0 && (
              <div className="flex justify-between text-red-400 font-medium">
                <span>Compounded Exemption Discount:</span>
                <span className="font-mono">- ₹{discountAmount.toLocaleString("en-IN")}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-400 border-b border-dashed border-slate-800 pb-2.5">
              <span>Exempt Settlement subtotal:</span>
              <span className="font-mono text-slate-200">₹{discountedAmount.toLocaleString("en-IN")}</span>
            </div>

            {showLegalFee ? (
              <div className="flex justify-between text-slate-400">
                <span>Legal Advisory Services:</span>
                <span className="font-mono text-slate-200">+ ₹{legalFee.toLocaleString("en-IN")}</span>
              </div>
            ) : (
              <div className="flex justify-between text-slate-500 italic">
                <span>Legal Fees on client invoice:</span>
                <span>Omitted</span>
              </div>
            )}

            {/* Total Highlight */}
            <div className="flex justify-between items-center pt-3 text-slate-100 border-t border-slate-800">
              <span className="font-display text-sm">TOTAL CLIENT OUTLAY:</span>
              <span className="font-mono text-xl font-extrabold text-amber-400">
                ₹{finalAmount.toLocaleString("en-IN")}
              </span>
            </div>

          </div>

          {/* Error notifications */}
          {error && (
            <div className="bg-red-950/60 border border-red-900 text-red-200 p-3 rounded-lg flex items-start gap-2 text-xs">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* CTA Generater lock */}
          <button
            onClick={handleGenerateInvoice}
            disabled={isSubmitting}
            className={`w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-700 text-slate-950 font-display font-semibold rounded-xl text-center text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>Synchronizing SQL Record...</span>
              </>
            ) : (
              <>
                <FileCheck size={16} />
                <span>Generate Final Invoice</span>
              </>
            )}
          </button>

          <p className="text-[10px] text-slate-500 text-center font-mono leading-relaxed px-2">
            Proceeding will record transaction in database and allocate the invoice number seq {nextInvoiceNo}.
          </p>

        </div>

      </div>

    </div>
  );
}
