"use client";
import { FilterState, UDSRecord, getUniqueValues } from "@/lib/utils";
import { X, SlidersHorizontal } from "lucide-react";

interface FilterBarProps {
  data: UDSRecord[];
  filters: FilterState;
  onChange: (f: FilterState) => void;
}

const FILTER_FIELDS: { key: keyof FilterState; label: string }[] = [
  { key: "client_name", label: "Client" },
  { key: "client_category", label: "Category" },
  { key: "payment_mode", label: "Payment" },
  { key: "ticket_status", label: "Ticket Status" },
  { key: "ticket_reason", label: "Ticket Reason" },
  { key: "hub_name", label: "Hub" },
  { key: "current_order_status", label: "Order Status" },
  { key: "tag", label: "Tag" },
  { key: "ticket_source", label: "Source" },
  { key: "order_type", label: "Order Type" },
];

export default function FilterBar({ data, filters, onChange }: FilterBarProps) {
  const hasAnyFilter = Object.values(filters).some(Boolean);

  const selectStyle = {
    background: "#0f1629",
    border: "1px solid rgba(56,189,248,0.18)",
    color: "#e2e8f0",
    borderRadius: "8px",
    padding: "7px 28px 7px 10px",
    fontSize: "13px",
    cursor: "pointer",
    minWidth: "130px",
    maxWidth: "170px",
    outline: "none",
    transition: "border-color 0.2s",
  };

  return (
    <div
      className="rounded-xl p-4"
      style={{ background: "#0f1629", border: "1px solid rgba(56,189,248,0.12)" }}
    >
      <div className="flex items-center gap-2 mb-3">
        <SlidersHorizontal size={15} color="#38bdf8" />
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#38bdf8" }}>
          Filters
        </span>
        {hasAnyFilter && (
          <button
            onClick={() => onChange(Object.fromEntries(Object.keys(filters).map((k) => [k, ""])) as FilterState)}
            className="ml-auto flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-all hover:opacity-80"
            style={{ background: "rgba(251,113,133,0.12)", border: "1px solid rgba(251,113,133,0.25)", color: "#fb7185" }}
          >
            <X size={11} /> Clear all
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {FILTER_FIELDS.map(({ key, label }) => {
          const opts = getUniqueValues(data, key as keyof UDSRecord);
          if (opts.length === 0) return null;
          return (
            <select
              key={key}
              value={filters[key]}
              onChange={(e) => onChange({ ...filters, [key]: e.target.value })}
              style={{
                ...selectStyle,
                borderColor: filters[key] ? "rgba(56,189,248,0.5)" : "rgba(56,189,248,0.18)",
                boxShadow: filters[key] ? "0 0 8px rgba(56,189,248,0.12)" : "none",
              }}
            >
              <option value="">{label}</option>
              {opts.map((v) => (
                <option key={v} value={v}>{v.length > 22 ? v.slice(0, 22) + "…" : v}</option>
              ))}
            </select>
          );
        })}
      </div>
      {hasAnyFilter && (
        <div className="mt-2 flex flex-wrap gap-1">
          {FILTER_FIELDS.filter(({ key }) => filters[key]).map(({ key, label }) => (
            <span
              key={key}
              className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
              style={{ background: "rgba(56,189,248,0.12)", border: "1px solid rgba(56,189,248,0.3)", color: "#38bdf8" }}
            >
              {label}: {filters[key]}
              <button onClick={() => onChange({ ...filters, [key]: "" })} className="hover:opacity-70">
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
