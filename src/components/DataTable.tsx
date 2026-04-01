"use client";
import { useState } from "react";
import { UDSRecord } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

const VISIBLE_COLUMNS = [
  "awb_number", "client_name", "payment_mode",
  "ticket_reason", "ticket_status", "hub_name",
  "current_order_status", "rider_name", "total_number_of_calls_made"
];

const COL_LABELS: Record<string, string> = {
  awb_number: "AWB",
  client_name: "Client",
  payment_mode: "Payment",
  ticket_reason: "Reason",
  ticket_status: "Status",
  hub_name: "Hub",
  current_order_status: "Order Status",
  rider_name: "Rider",
  total_number_of_calls_made: "Calls",
};

interface DataTableProps { data: UDSRecord[] }

export default function DataTable({ data }: DataTableProps) {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const PAGE_SIZE = 15;

  const filtered = search
    ? data.filter((r) => VISIBLE_COLUMNS.some((c) => r[c]?.toLowerCase().includes(search.toLowerCase())))
    : data;

  const total = filtered.length;
  const pages = Math.ceil(total / PAGE_SIZE);
  const rows = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const statusColor = (val: string) => {
    const v = val?.toLowerCase() || "";
    if (v.includes("close") || v.includes("resolved")) return "#34d399";
    if (v.includes("open") || v.includes("pending")) return "#fbbf24";
    if (v.includes("cancel")) return "#fb7185";
    return "#38bdf8";
  };

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(56,189,248,0.12)" }}>
      <div className="flex items-center justify-between px-4 py-3" style={{ background: "#0f1629", borderBottom: "1px solid rgba(56,189,248,0.1)" }}>
        <span className="text-sm font-semibold font-display" style={{ color: "#e2e8f0" }}>
          Shipment Records <span style={{ color: "rgba(56,189,248,0.6)", fontSize: "12px" }}>({total.toLocaleString()})</span>
        </span>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "#151e36", border: "1px solid rgba(56,189,248,0.15)" }}>
          <Search size={13} color="rgba(226,232,240,0.4)" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            placeholder="Search table..."
            className="bg-transparent outline-none text-xs"
            style={{ color: "#e2e8f0", width: "160px" }}
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr style={{ background: "#151e36", borderBottom: "1px solid rgba(56,189,248,0.1)" }}>
              {VISIBLE_COLUMNS.map((col) => (
                <th key={col} className="px-3 py-2.5 text-left font-semibold uppercase tracking-wide whitespace-nowrap" style={{ color: "rgba(56,189,248,0.7)", fontSize: "10px" }}>
                  {COL_LABELS[col] || col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="table-row-hover transition-colors" style={{ borderBottom: "1px solid rgba(56,189,248,0.05)", background: i % 2 === 0 ? "transparent" : "rgba(56,189,248,0.015)" }}>
                {VISIBLE_COLUMNS.map((col) => (
                  <td key={col} className="px-3 py-2.5 whitespace-nowrap max-w-[160px] overflow-hidden text-ellipsis" style={{ color: col === "ticket_status" ? statusColor(row[col]) : "rgba(226,232,240,0.7)" }}>
                    {row[col] || "—"}
                  </td>
                ))}
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={VISIBLE_COLUMNS.length} className="text-center py-12" style={{ color: "rgba(226,232,240,0.3)" }}>
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between px-4 py-3" style={{ background: "#0f1629", borderTop: "1px solid rgba(56,189,248,0.1)" }}>
        <span className="text-xs" style={{ color: "rgba(226,232,240,0.4)" }}>
          {total === 0 ? "0 records" : `${page * PAGE_SIZE + 1}–${Math.min((page + 1) * PAGE_SIZE, total)} of ${total.toLocaleString()}`}
        </span>
        <div className="flex gap-1">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="p-1.5 rounded-lg transition-colors disabled:opacity-30"
            style={{ background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.2)", color: "#38bdf8" }}
          >
            <ChevronLeft size={14} />
          </button>
          <span className="px-2 py-1 text-xs" style={{ color: "rgba(226,232,240,0.5)" }}>{page + 1} / {Math.max(1, pages)}</span>
          <button
            onClick={() => setPage((p) => Math.min(pages - 1, p + 1))}
            disabled={page >= pages - 1}
            className="p-1.5 rounded-lg transition-colors disabled:opacity-30"
            style={{ background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.2)", color: "#38bdf8" }}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
