"use client";
import { useState, useMemo, useCallback } from "react";
import Papa from "papaparse";
import {
  Package, AlertCircle, CheckCircle2, RefreshCw,
  BarChart3, PhoneCall, Truck, Activity, Download
} from "lucide-react";
import { UDSRecord, FilterState, EMPTY_FILTERS, applyFilters, countBy, getInsights } from "@/lib/utils";
import StatCard from "@/components/StatCard";
import FilterBar from "@/components/FilterBar";
import InsightPanel from "@/components/InsightPanel";
import DataTable from "@/components/DataTable";
import FileUpload from "@/components/FileUpload";
import {
  TicketStatusChart, TicketReasonChart, PaymentModeChart,
  HubChart, CallAttemptsChart, OrderStatusChart
} from "@/components/Charts";

export default function Dashboard() {
  const [allData, setAllData] = useState<UDSRecord[]>([]);
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [filename, setFilename] = useState("");
  const [tab, setTab] = useState<"overview" | "charts" | "table">("overview");

  const handleUpload = useCallback((csvText: string, fname: string) => {
    const result = Papa.parse<UDSRecord>(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim().toLowerCase().replace(/\s+/g, "_"),
    });
    setAllData(result.data as UDSRecord[]);
    setFilename(fname);
    setFilters(EMPTY_FILTERS);
  }, []);

  const filtered = useMemo(() => applyFilters(allData, filters), [allData, filters]);

  const hasFilter = Object.values(filters).some(Boolean);

  // Stats
  const totalTickets = filtered.length;
  const uniqueAWBs = new Set(filtered.map((r) => r.awb_number)).size;
  const openTickets = filtered.filter((r) => r.ticket_status?.toLowerCase().includes("open")).length;
  const resolvedTickets = filtered.filter((r) => r.ticket_status?.toLowerCase().includes("close") || r.ticket_status?.toLowerCase().includes("resolved")).length;
  const repeatTickets = filtered.filter((r) => parseInt(r.ticket_repeat_count || "0") > 1).length;
  const avgCalls = filtered.length > 0
    ? (filtered.reduce((s, r) => s + (parseFloat(r.total_number_of_calls_made) || 0), 0) / filtered.length).toFixed(1)
    : "0";
  const badScans = filtered.filter((r) => r.bad_scan_flag_of_last_attempt_before_ticket_created?.toLowerCase() === "yes" || r.bad_scan_flag_of_last_attempt_before_ticket_created === "1").length;

  const insights = useMemo(() => getInsights(allData, filtered, hasFilter), [allData, filtered, hasFilter]);

  const handleExport = () => {
    const csv = Papa.unparse(filtered);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `uds_filtered_${Date.now()}.csv`;
    a.click();
  };

  const TABS = [
    { id: "overview", label: "Overview", icon: <Activity size={13} /> },
    { id: "charts", label: "Analytics", icon: <BarChart3 size={13} /> },
    { id: "table", label: "Records", icon: <Package size={13} /> },
  ];

  if (allData.length === 0) {
    return (
      <main className="min-h-screen grid-bg flex flex-col">
        <header className="px-8 py-5 flex items-center gap-3" style={{ borderBottom: "1px solid rgba(56,189,248,0.1)", background: "rgba(10,14,26,0.9)" }}>
          <div className="p-2 rounded-xl" style={{ background: "rgba(56,189,248,0.1)" }}>
            <Truck size={20} color="#38bdf8" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-display" style={{ color: "#e2e8f0" }}>UDS Analytics Portal</h1>
            <p className="text-xs" style={{ color: "rgba(226,232,240,0.4)" }}>Undelivered Shipment Intelligence</p>
          </div>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="w-full max-w-lg">
            <FileUpload onUpload={handleUpload} />
            <p className="text-center text-xs mt-4" style={{ color: "rgba(226,232,240,0.3)" }}>
              Export Google Sheet → File → Download → CSV format, then upload here
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen grid-bg">
      {/* Header */}
      <header className="sticky top-0 z-20 px-6 py-3 flex items-center gap-3" style={{ borderBottom: "1px solid rgba(56,189,248,0.1)", background: "rgba(10,14,26,0.95)", backdropFilter: "blur(12px)" }}>
        <div className="p-1.5 rounded-lg" style={{ background: "rgba(56,189,248,0.1)" }}>
          <Truck size={18} color="#38bdf8" />
        </div>
        <div>
          <h1 className="text-base font-bold font-display leading-tight" style={{ color: "#e2e8f0" }}>UDS Analytics Portal</h1>
          <p className="text-xs" style={{ color: "rgba(226,232,240,0.35)" }}>{filename}</p>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs px-2 py-1 rounded-lg" style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)", color: "#34d399" }}>
            <span className="pulse-dot inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5" />
            {allData.length.toLocaleString()} records
          </span>
          <button
            onClick={() => { setAllData([]); setFilename(""); }}
            className="text-xs px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
            style={{ background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.2)", color: "#38bdf8" }}
          >
            <RefreshCw size={12} className="inline mr-1" />New File
          </button>
          {filtered.length > 0 && (
            <button
              onClick={handleExport}
              className="text-xs px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
              style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)", color: "#34d399" }}
            >
              <Download size={12} className="inline mr-1" />Export CSV
            </button>
          )}
        </div>
      </header>

      <div className="px-6 py-5 space-y-5 max-w-screen-2xl mx-auto">
        {/* Filters */}
        <FilterBar data={allData} filters={filters} onChange={setFilters} />

        {/* Filter insights */}
        {hasFilter && (
          <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg" style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)", color: "#fbbf24" }}>
            <AlertCircle size={13} />
            Showing <strong>{filtered.length.toLocaleString()}</strong> of {allData.length.toLocaleString()} records based on active filters
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: "#0f1629", border: "1px solid rgba(56,189,248,0.12)" }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as typeof tab)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all"
              style={{
                background: tab === t.id ? "rgba(56,189,248,0.15)" : "transparent",
                color: tab === t.id ? "#38bdf8" : "rgba(226,232,240,0.5)",
                border: tab === t.id ? "1px solid rgba(56,189,248,0.3)" : "1px solid transparent",
              }}
            >
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {tab === "overview" && (
          <div className="space-y-5">
            {/* KPI Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              <StatCard label="Total Tickets" value={totalTickets.toLocaleString()} icon={<Package size={16} />} color="blue" delay={0} />
              <StatCard label="Unique AWBs" value={uniqueAWBs.toLocaleString()} icon={<Truck size={16} />} color="violet" delay={60} />
              <StatCard label="Open Tickets" value={openTickets.toLocaleString()} icon={<AlertCircle size={16} />} color="amber" delay={120} sub={`${totalTickets ? ((openTickets / totalTickets) * 100).toFixed(1) : 0}% of total`} />
              <StatCard label="Resolved" value={resolvedTickets.toLocaleString()} icon={<CheckCircle2 size={16} />} color="emerald" delay={180} sub={`${totalTickets ? ((resolvedTickets / totalTickets) * 100).toFixed(1) : 0}% resolved`} />
              <StatCard label="Repeat Tickets" value={repeatTickets.toLocaleString()} icon={<RefreshCw size={16} />} color="rose" delay={240} sub="AWBs w/ >1 ticket" />
              <StatCard label="Avg Calls/AWB" value={avgCalls} icon={<PhoneCall size={16} />} color="blue" delay={300} />
              <StatCard label="Bad Scans" value={badScans.toLocaleString()} icon={<AlertCircle size={16} />} color="amber" delay={360} sub="last attempt" />
            </div>

            {/* Insights */}
            <InsightPanel insights={insights} title={hasFilter ? "Filtered Insights" : "Overall Insights"} />

            {/* Quick charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <TicketStatusChart data={filtered} />
              <PaymentModeChart data={filtered} />
              <OrderStatusChart data={filtered} />
            </div>
          </div>
        )}

        {/* CHARTS TAB */}
        {tab === "charts" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TicketStatusChart data={filtered} />
              <TicketReasonChart data={filtered} />
              <PaymentModeChart data={filtered} />
              <HubChart data={filtered} />
              <CallAttemptsChart data={filtered} />
              <OrderStatusChart data={filtered} />
            </div>

            {/* Top Clients Table */}
            <div className="rounded-xl p-4" style={{ background: "#0f1629", border: "1px solid rgba(56,189,248,0.12)" }}>
              <h3 className="text-sm font-semibold mb-3 font-display" style={{ color: "#e2e8f0" }}>Top 10 Clients by UDS Tickets</h3>
              <div className="space-y-1.5">
                {countBy(filtered, "client_name").slice(0, 10).map((item, i) => {
                  const pct = ((item.value / filtered.length) * 100).toFixed(1);
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-xs w-4 text-right" style={{ color: "rgba(226,232,240,0.3)" }}>{i + 1}</span>
                      <span className="text-xs w-48 truncate" style={{ color: "rgba(226,232,240,0.7)" }}>{item.name}</span>
                      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(56,189,248,0.1)" }}>
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "linear-gradient(90deg, #38bdf8, #0ea5e9)" }} />
                      </div>
                      <span className="text-xs w-10 text-right font-mono" style={{ color: "#38bdf8" }}>{item.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TABLE TAB */}
        {tab === "table" && <DataTable data={filtered} />}
      </div>
    </main>
  );
}
