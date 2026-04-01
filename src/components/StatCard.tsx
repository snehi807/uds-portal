"use client";
import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: ReactNode;
  color?: "blue" | "emerald" | "amber" | "rose" | "violet";
  delay?: number;
}

const colorMap = {
  blue: { bg: "rgba(56,189,248,0.08)", border: "rgba(56,189,248,0.25)", text: "#38bdf8", glow: "rgba(56,189,248,0.15)" },
  emerald: { bg: "rgba(52,211,153,0.08)", border: "rgba(52,211,153,0.25)", text: "#34d399", glow: "rgba(52,211,153,0.15)" },
  amber: { bg: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.25)", text: "#fbbf24", glow: "rgba(251,191,36,0.15)" },
  rose: { bg: "rgba(251,113,133,0.08)", border: "rgba(251,113,133,0.25)", text: "#fb7185", glow: "rgba(251,113,133,0.15)" },
  violet: { bg: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.25)", text: "#a78bfa", glow: "rgba(167,139,250,0.15)" },
};

export default function StatCard({ label, value, sub, icon, color = "blue", delay = 0 }: StatCardProps) {
  const c = colorMap[color];
  return (
    <div
      className="animate-fade-up rounded-xl p-5 flex flex-col gap-3 transition-all duration-300 hover:scale-[1.02]"
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        boxShadow: `0 4px 24px ${c.glow}`,
        animationDelay: `${delay}ms`,
        opacity: 0,
        animationFillMode: "forwards",
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-widest" style={{ color: "rgba(226,232,240,0.5)" }}>
          {label}
        </span>
        <span style={{ color: c.text }}>{icon}</span>
      </div>
      <div className="text-3xl font-display font-bold" style={{ color: "#f1f5f9" }}>
        {value}
      </div>
      {sub && <div className="text-xs" style={{ color: "rgba(226,232,240,0.45)" }}>{sub}</div>}
    </div>
  );
}
