"use client";
import { Lightbulb, TrendingUp } from "lucide-react";

interface InsightPanelProps {
  insights: string[];
  title?: string;
}

export default function InsightPanel({ insights, title = "AI Insights" }: InsightPanelProps) {
  if (!insights || insights.length === 0) return null;
  return (
    <div
      className="rounded-xl p-5"
      style={{
        background: "linear-gradient(135deg, rgba(56,189,248,0.06), rgba(14,165,233,0.03))",
        border: "1px solid rgba(56,189,248,0.2)",
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div
          className="p-1.5 rounded-lg"
          style={{ background: "rgba(56,189,248,0.15)" }}
        >
          <Lightbulb size={14} color="#38bdf8" />
        </div>
        <span className="text-sm font-semibold font-display" style={{ color: "#38bdf8" }}>
          {title}
        </span>
        <span
          className="ml-auto text-xs px-2 py-0.5 rounded-full"
          style={{ background: "rgba(56,189,248,0.1)", color: "rgba(56,189,248,0.7)", border: "1px solid rgba(56,189,248,0.15)" }}
        >
          {insights.length} insights
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {insights.map((insight, i) => (
          <div
            key={i}
            className="flex items-start gap-2.5 p-3 rounded-lg"
            style={{
              background: "rgba(15,22,41,0.6)",
              border: "1px solid rgba(56,189,248,0.1)",
              animationDelay: `${i * 60}ms`,
            }}
          >
            <TrendingUp size={13} color="#38bdf8" className="mt-0.5 flex-shrink-0 opacity-70" />
            <span className="text-xs leading-relaxed" style={{ color: "rgba(226,232,240,0.75)" }}>
              {insight}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
