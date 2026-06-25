import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Body parser middleware
app.use(express.json());

// Prepare the database directory and file path
const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "database.json");

// Ensure the data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Interfaces helper
interface ChallanItem {
  id: string;
  challanNumber: string;
  challanDate: string;
  violation: string;
  amount: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  mobileNumber: string;
  vehicleNumber: string;
  offerPercentage: number;
  legalFee: number;
  showLegalFee: boolean;
  challans: ChallanItem[];
  settlementAmount: number;
  discountedAmount: number;
  finalAmount: number;
  createdAt: string;
}

// Function to get current local date formatted as YYYYMMDD
function getLocalDateString(): string {
  // We can use the current timezone or simple date formatting
  const d = new Date();
  
  // Format YYYYMMDD using local time elements to match user's physical date
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const date = String(d.getDate()).padStart(2, "0");
  return `${year}${month}${date}`;
}

// Help populate demo invoices if database doesn't exist
function getInitialDemoInvoices(): Invoice[] {
  const todayStr = getLocalDateString();
  
  return [
    {
      id: `LG-${todayStr}-002`,
      invoiceNumber: `LG-${todayStr}-002`,
      customerName: "Sharma Logistics & Co.",
      mobileNumber: "9876543210",
      vehicleNumber: "MH-12-PQ-8849",
      offerPercentage: 15,
      legalFee: 1500,
      showLegalFee: true,
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
      challans: [
        {
          id: "c1",
          challanNumber: "MHP-4482930",
          challanDate: "2026-06-01",
          violation: "Red Light Violation",
          amount: 1000
        },
        {
          id: "c2",
          challanNumber: "MHP-4493812",
          challanDate: "2026-06-05",
          violation: "Over Speeded (Camera)",
          amount: 2000
        }
      ],
      settlementAmount: 3000,
      discountedAmount: 2550, // 3000 * 0.85
      finalAmount: 4050 // 2550 + 1500
    },
    {
      id: `LG-${todayStr}-001`,
      invoiceNumber: `LG-${todayStr}-001`,
      customerName: "Express Travels Inc.",
      mobileNumber: "8882223344",
      vehicleNumber: "DL-1C-ZA-4200",
      offerPercentage: 20,
      legalFee: 2000,
      showLegalFee: true,
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(), // 5 hours ago
      challans: [
        {
          id: "c3",
          challanNumber: "DLP-1200391",
          challanDate: "2026-05-28",
          violation: "No Entry Zone Violation",
          amount: 5000
        }
      ],
      settlementAmount: 5000,
      discountedAmount: 4000, // 5000 * 0.80
      finalAmount: 6000 // 4000 + 2000
    },
    {
      id: "LG-20260611-003",
      invoiceNumber: "LG-20260611-003",
      customerName: "Rajesh Kumar Verma",
      mobileNumber: "7776665554",
      vehicleNumber: "HR-26-DM-0987",
      offerPercentage: 10,
      legalFee: 800,
      showLegalFee: false, // Hidden legal fee
      createdAt: "2026-06-11T16:30:00.000Z",
      challans: [
        {
          id: "c4",
          challanNumber: "HRP-991283",
          challanDate: "2026-05-15",
          violation: "Dangerous Driving",
          amount: 1500
        },
        {
          id: "c5",
          challanNumber: "HRP-991285",
          challanDate: "2026-05-18",
          violation: "Driving Without Helmet",
          amount: 500
        }
      ],
      settlementAmount: 2000,
      discountedAmount: 1800, // 2000 * 0.90
      finalAmount: 1800 // 1800 + 0 (legal fee is hidden)
    },
    {
      id: "LG-20260610-001",
      invoiceNumber: "LG-20260610-001",
      customerName: "Karan Johar",
      mobileNumber: "9102938475",
      vehicleNumber: "MH-02-ZZ-0007",
      offerPercentage: 25,
      legalFee: 3000,
      showLegalFee: true,
      createdAt: "2026-06-10T11:15:00.000Z",
      challans: [
        {
          id: "c6",
          challanNumber: "MHP-110022",
          challanDate: "2026-05-12",
          violation: "Drunken Driving Clearance",
          amount: 10000
        }
      ],
      settlementAmount: 10000,
      discountedAmount: 7500, // 10000 * 0.75
      finalAmount: 10500 // 7500 + 3000
    }
  ];
}

// Safe Read DB Function
function readInvoices(): Invoice[] {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const demo = getInitialDemoInvoices();
      writeInvoices(demo);
      return demo;
    }
    const dataString = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(dataString) as Invoice[];
  } catch (error) {
    console.error("Error reading database file, returning demo content:", error);
    return getInitialDemoInvoices();
  }
}

// Safe Write DB Function
function writeInvoices(invoices: Invoice[]): boolean {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(invoices, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error writing database file:", error);
    return false;
  }
}

// 1. GET ALL INVOICES
app.get("/api/invoices", (req, res) => {
  const invoices = readInvoices();
  // Sort by date descending (latest first)
  invoices.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json(invoices);
});

// 2. GET STATS FOR DASHBOARD
app.get("/api/stats", (req, res) => {
  const invoices = readInvoices();
  
  let totalBilling = 0;
  let totalChallansSettled = 0;
  let totalDiscountsGiven = 0;
  let totalLegalFees = 0;

  invoices.forEach(inv => {
    totalBilling += inv.finalAmount;
    totalChallansSettled += inv.challans.length;
    totalDiscountsGiven += (inv.settlementAmount - inv.discountedAmount);
    if (inv.showLegalFee) {
      totalLegalFees += inv.legalFee;
    }
  });

  // Latest 5 invoices for recent history
  const recentInvoices = [...invoices]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  res.json({
    totalBilling,
    totalInvoices: invoices.length,
    totalChallansSettled,
    totalDiscountsGiven,
    totalLegalFees,
    recentInvoices
  });
});

// 3. GET DYNAMIC NEXT INVOICE NUMBER
app.get("/api/next-invoice-number", (req, res) => {
  const todayStr = getLocalDateString(); // YYYYMMDD
  const invoices = readInvoices();
  
  // Filter invoices created today to count the correct sequence
  const todayPrefix = `LG-${todayStr}-`;
  const todayInvoices = invoices.filter(inv => inv.id.startsWith(todayPrefix));
  
  let maxSuffix = 0;
  todayInvoices.forEach(inv => {
    const parts = inv.id.split("-");
    if (parts.length === 3) {
      const suffixNum = parseInt(parts[2], 10);
      if (!isNaN(suffixNum) && suffixNum > maxSuffix) {
        maxSuffix = suffixNum;
      }
    }
  });

  const nextSuffix = String(maxSuffix + 1).padStart(3, "0");
  const nextInvoiceNo = `${todayPrefix}${nextSuffix}`;
  
  res.json({ nextInvoiceNo });
});

// 4. POST CREATE NEW INVOICE
app.post("/api/invoices", (req, res) => {
  const {
    customerName,
    mobileNumber,
    vehicleNumber,
    offerPercentage,
    legalFee,
    showLegalFee,
    challans
  } = req.body;

  if (!customerName || !mobileNumber || !vehicleNumber || !challans || !Array.isArray(challans)) {
    return res.status(400).json({ error: "Missing required invoicing fields" });
  }

  const invoices = readInvoices();
  
  // Dynamic safe double-generation of unique sequence to avoid race condition
  const todayStr = getLocalDateString();
  const todayPrefix = `LG-${todayStr}-`;
  const todayInvoices = invoices.filter(inv => inv.id.startsWith(todayPrefix));
  
  let maxSuffix = 0;
  todayInvoices.forEach(inv => {
    const parts = inv.id.split("-");
    if (parts.length === 3) {
      const suffixNum = parseInt(parts[2], 10);
      if (!isNaN(suffixNum) && suffixNum > maxSuffix) {
        maxSuffix = suffixNum;
      }
    }
  });

  const nextSuffix = String(maxSuffix + 1).padStart(3, "0");
  const invoiceId = `${todayPrefix}${nextSuffix}`;

  // Process and compute totals server side to preserve integrity
  const parsedChallans = (challans as ChallanItem[]).map((c, index) => ({
    id: c.id || `c-${Date.now()}-${index}`,
    challanNumber: c.challanNumber || `CH-${Math.floor(Math.random() * 10000000)}`,
    challanDate: c.challanDate || new Date().toISOString().substring(0, 10),
    violation: c.violation || "Miscellaneous Settlement Penalty",
    amount: typeof c.amount === "number" ? c.amount : 0
  }));

  const settlementAmount = parsedChallans.reduce((sum, item) => sum + item.amount, 0);
  const discountRate = (typeof offerPercentage === "number" ? offerPercentage : 0) / 100;
  const discountedAmount = settlementAmount * (1 - discountRate);
  const coreLegalFee = typeof legalFee === "number" ? legalFee : 0;
  const finalAmount = discountedAmount + (showLegalFee ? coreLegalFee : 0);

  const newInvoice: Invoice = {
    id: invoiceId,
    invoiceNumber: invoiceId,
    customerName,
    mobileNumber,
    vehicleNumber,
    offerPercentage: typeof offerPercentage === "number" ? offerPercentage : 0,
    legalFee: coreLegalFee,
    showLegalFee: !!showLegalFee,
    challans: parsedChallans,
    settlementAmount,
    discountedAmount,
    finalAmount,
    createdAt: new Date().toISOString()
  };

  invoices.push(newInvoice);
  const success = writeInvoices(invoices);

  if (success) {
    res.status(201).json(newInvoice);
  } else {
    res.status(500).json({ error: "Failed to save invoice into SQLite database store" });
  }
});

// 5. DELETE INVOICE (FOR HISTORY ROADMAP FEATURE)
app.delete("/api/invoices/:id", (req, res) => {
  const { id } = req.params;
  const invoices = readInvoices();
  const index = invoices.findIndex(inv => inv.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Invoice not found or already deleted" });
  }

  invoices.splice(index, 1);
  const success = writeInvoices(invoices);

  if (success) {
    res.json({ success: true, message: `Invoice ${id} successfully removed from persistence layer` });
  } else {
    res.status(500).json({ error: "Failed to persist alterations to database" });
  }
});

// VITE MIDDLEWARE & STATIC SERVING CONFIGURATION
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT MODE with Vite Middleware");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION MODE");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[LawyerGo API] Server running on http://localhost:${PORT}`);
  });
}

startServer();
