"use client";

import { Download } from "lucide-react";

interface ExportButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export default function ExportButton({
  onClick,
  disabled = false,
}: ExportButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        height: "36px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "7px",
        padding: "0 12px",
        border: "none",
        backgroundColor: "transparent",
        color: disabled ? "#aaaaaa" : "#2563eb",
        fontSize: "11px",
        fontWeight: 500,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      <Download
        size={13}
        strokeWidth={1.8}
      />

      <span>Export</span>
    </button>
  );
}