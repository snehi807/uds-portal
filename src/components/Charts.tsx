"use client";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { UDSRecord, countBy } from "@/lib/utils";

const COLORS = ["#38bdf8", "#34d399", "#fbbf24", "#fb7185", "#a78bfa", "#f97316", "#06b6d4", "#84cc16"];

const tooltipStyle = {
  backgroundColor: "#0f1629",
  border: "1px solid rgba(56,189,248,0.25)",
  borderRadius: "8px",
  color: "#e2e8f0",
  fontSize: "12px",
};

interface ChartProps { data: UDSRecord[] }

export function TicketStatusChart({ data }: ChartProps) {
  const chartData = countBy(data, "ticket_status").slice(0, 8);
  return (
    <div className="rounded-xl p-4" style={{ background: "#0f1629", border: "1px solid rgba(56,189,248,0.12)" }}>
      <h3 className="text-sm font-semibold mb-4 font-display" style={{ color: "#e2e8f0" }}>Ticket Status Distribution</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 4 }}>
          <XAxis dataKey="name" tick={{ fill: "rgba(226,232,240,0.5)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "rgba(226,232,240,0.5)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(56,189,248,0.05)" }} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TicketReasonChart({ data }: ChartProps) {
  const chartData = countBy(data, "ticket_reason").slice(0, 6);
  return (
    <div className="rounded-xl p-4" style={{ background: "#0f1629", border: "1px solid rgba(56,189,248,0.12)" }}>
      <h3 className="text-sm font-semibold mb-4 font-display" style={{ color: "#e2e8f0" }}>Top Ticket Reasons</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 16, left: 4, bottom: 4 }}>
          <XAxis type="number" tick={{ fill: "rgba(226,232,240,0.5)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis dataKey="name" type="category" tick={{ fill: "rgba(226,232,240,0.5)", fontSize: 10 }} axisLine={false} tickLine={false} width={110} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(56,189,248,0.05)" }} />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PaymentModeChart({ data }: ChartProps) {
  const chartData = countBy(data, "payment_mode").slice(0, 6);
  return (
    <div className="rounded-xl p-4" style={{ background: "#0f1629", border: "1px solid rgba(56,189,248,0.12)" }}>
      <h3 className="text-sm font-semibold mb-4 font-display" style={{ color: "#e2e8f0" }}>Payment Mode Split</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} paddingAngle={3}>
            {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: "11px", color: "rgba(226,232,240,0.6)" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function HubChart({ data }: ChartProps) {
  const chartData = countBy(data, "hub_name").slice(0, 8);
  return (
    <div className="rounded-xl p-4" style={{ background: "#0f1629", border: "1px solid rgba(56,189,248,0.12)" }}>
      <h3 className="text-sm font-semibold mb-4 font-display" style={{ color: "#e2e8f0" }}>Top Hubs by UDS Tickets</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 40 }}>
          <XAxis dataKey="name" tick={false} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "rgba(226,232,240,0.5)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(56,189,248,0.05)" }} />
          <Bar dataKey="value" fill="#38bdf8" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CallAttemptsChart({ data }: ChartProps) {
  const buckets: Record<string, number> = { "0 calls": 0, "1 call": 0, "2 calls": 0, "3+ calls": 0 };
  data.forEach((r) => {
    const n = parseInt(r.total_number_of_calls_made || "0");
    if (n === 0) buckets["0 calls"]++;
    else if (n === 1) buckets["1 call"]++;
    else if (n === 2) buckets["2 calls"]++;
    else buckets["3+ calls"]++;
  });
  const chartData = Object.entries(buckets).map(([name, value]) => ({ name, value }));
  return (
    <div className="rounded-xl p-4" style={{ background: "#0f1629", border: "1px solid rgba(56,189,248,0.12)" }}>
      <h3 className="text-sm font-semibold mb-4 font-display" style={{ color: "#e2e8f0" }}>Call Attempts Distribution</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 4 }}>
          <XAxis dataKey="name" tick={{ fill: "rgba(226,232,240,0.5)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "rgba(226,232,240,0.5)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(56,189,248,0.05)" }} />
          <Bar dataKey="value" fill="#34d399" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function OrderStatusChart({ data }: ChartProps) {
  const chartData = countBy(data, "current_order_status").slice(0, 6);
  return (
    <div className="rounded-xl p-4" style={{ background: "#0f1629", border: "1px solid rgba(56,189,248,0.12)" }}>
      <h3 className="text-sm font-semibold mb-4 font-display" style={{ color: "#e2e8f0" }}>Current Order Status</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} paddingAngle={3}>
            {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: "11px", color: "rgba(226,232,240,0.6)" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
