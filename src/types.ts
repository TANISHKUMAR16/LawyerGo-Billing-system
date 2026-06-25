/**
 * TYPES FOR THE LAWYERGO BILLING SYSTEM
 */

export interface ChallanItem {
  id: string;
  challanNumber: string;
  challanDate: string;
  violation: string;
  amount: number;
}

export interface Invoice {
  id: string; // The LG-YYYYMMDD-XXX format, acts as both key and invoice number
  invoiceNumber: string; // Redundant but good for database consistency
  customerName: string;
  mobileNumber: string;
  vehicleNumber: string;
  offerPercentage: number; // e.g. 15 for 15%
  legalFee: number; // Legal fee amount
  showLegalFee: boolean; // Hide/Show Toggle
  challans: ChallanItem[];
  settlementAmount: number; // Sum of challans (raw subtotal)
  discountedAmount: number; // Subtotal after discount applied
  finalAmount: number; // DiscountedAmount + LegalFee (if showLegalFee is true)
  createdAt: string; // ISO date string
}

export interface DashboardStats {
  totalBilling: number; // Sum of finalAmount of all invoices
  totalInvoices: number; // Count of invoices
  totalChallansSettled: number; // Sum of count of challans across all invoices
  totalDiscountsGiven: number; // Sum of (settlementAmount - discountedAmount)
  totalLegalFees: number; // Sum of legalFee (where showLegalFee is true)
  recentInvoices: Invoice[];
}
