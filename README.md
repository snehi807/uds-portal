# UDS Analytics Portal

A production-grade analytics dashboard for Undelivered Shipment (UDS) data — built with Next.js 14, Tailwind CSS, and Recharts. Deploy to Vercel in minutes.

---

## 🚀 Deployment Steps

### Step 1: Get the Code onto GitHub

1. Create a new repository on [github.com](https://github.com/new)
   - Name it: `uds-portal`
   - Set to **Private** (recommended for internal tools)
   - Do NOT initialize with README

2. Upload this project folder:
   ```bash
   cd uds-portal
   git init
   git add .
   git commit -m "Initial commit: UDS Analytics Portal"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/uds-portal.git
   git push -u origin main
   ```

---

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (use GitHub login)
2. Click **"Add New Project"**
3. Select your `uds-portal` repository
4. Vercel will auto-detect **Next.js** — no changes needed
5. Click **"Deploy"**

That's it! Your portal will be live at `https://uds-portal.vercel.app` (or similar).

---

### Step 3: Use the Portal

1. Open your Google Sheet
2. Go to **File → Download → Comma Separated Values (.csv)**
3. Visit your Vercel URL
4. Drag & drop (or click to upload) the CSV file
5. Use filters, explore charts, and get insights!

---

## 🔧 Local Development

```bash
npm install
npm run dev
# Open http://localhost:3000
```

---

## 📊 Features

### Filters (10 dimensions)
- Client Name
- Client Category
- Payment Mode (COD/Prepaid)
- Ticket Status
- Ticket Reason
- Hub Name
- Current Order Status
- Tag
- Ticket Source
- Order Type

### Insights (auto-generated)
- Ticket status breakdown %
- Top ticket reason analysis
- COD risk exposure
- Bad scan flag count
- Geo-location delivery issues
- Repeat ticket patterns
- Hub performance
- Call attempt gaps
- X-seal flag alerts

### Charts (6 visualizations)
- Ticket Status Distribution (bar)
- Top Ticket Reasons (horizontal bar)
- Payment Mode Split (pie)
- Top Hubs by UDS Count (bar)
- Call Attempts Distribution (bar)
- Current Order Status (pie)

### Data Table
- Paginated records (15/page)
- In-table search
- Color-coded ticket status
- CSV export of filtered data

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Charts | Recharts |
| CSV Parsing | PapaParse |
| Icons | Lucide React |
| Fonts | Syne + Inter (Google Fonts) |
| Hosting | Vercel |

---

## 📁 Project Structure

```
uds-portal/
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root layout + fonts
│   │   ├── page.tsx          # Main dashboard
│   │   └── globals.css       # Global styles
│   ├── components/
│   │   ├── StatCard.tsx      # KPI stat cards
│   │   ├── FilterBar.tsx     # Filter dropdowns
│   │   ├── InsightPanel.tsx  # AI insight chips
│   │   ├── Charts.tsx        # All chart components
│   │   ├── DataTable.tsx     # Paginated data table
│   │   └── FileUpload.tsx    # CSV drag-drop upload
│   └── lib/
│       └── utils.ts          # Data logic & types
├── package.json
├── tailwind.config.js
├── next.config.js
└── vercel.json
```
