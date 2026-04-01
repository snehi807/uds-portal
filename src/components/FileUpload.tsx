"use client";
import { useRef, useState } from "react";
import { Upload, FileSpreadsheet } from "lucide-react";

interface FileUploadProps {
  onUpload: (csvText: string, filename: string) => void;
}

export default function FileUpload({ onUpload }: FileUploadProps) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => onUpload(e.target?.result as string, file.name);
    reader.readAsText(file);
  };

  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl p-12 cursor-pointer transition-all duration-300"
      style={{
        background: dragging ? "rgba(56,189,248,0.08)" : "rgba(15,22,41,0.8)",
        border: `2px dashed ${dragging ? "rgba(56,189,248,0.6)" : "rgba(56,189,248,0.2)"}`,
        boxShadow: dragging ? "0 0 30px rgba(56,189,248,0.1)" : "none",
      }}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
      }}
      onClick={() => inputRef.current?.click()}
    >
      <div className="p-4 rounded-2xl mb-4" style={{ background: "rgba(56,189,248,0.1)" }}>
        <FileSpreadsheet size={36} color="#38bdf8" />
      </div>
      <h3 className="text-lg font-bold font-display mb-2" style={{ color: "#e2e8f0" }}>Upload UDS CSV File</h3>
      <p className="text-sm text-center max-w-xs" style={{ color: "rgba(226,232,240,0.45)" }}>
        Export your Google Sheet as CSV and drop it here, or click to browse
      </p>
      <div className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.2)" }}>
        <Upload size={13} color="#38bdf8" />
        <span className="text-xs font-medium" style={{ color: "#38bdf8" }}>Choose CSV file</span>
      </div>
      <input ref={inputRef} type="file" accept=".csv" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
    </div>
  );
}
