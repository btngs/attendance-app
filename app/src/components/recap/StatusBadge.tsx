import type { StatusKehadiran } from "../../types/rekapitulasi";

interface StatusBadgeProps {
  status: StatusKehadiran;
}

const STATUS_STYLES: Record<
  StatusKehadiran,
  {
    background: string;
    color: string;
  }
> = {
  Hadir: {
    background: "#dcfce7",
    color: "#15803d",
  },

  "Tidak hadir": {
    background: "#ffe4e6",
    color: "#e11d48",
  },

  Terlambat: {
    background: "#fef3c7",
    color: "#d97706",
  },

  Izin: {
    background: "#e0f2fe",
    color: "#0284c7",
  },

  WFH: {
    background: "#e0f2fe",
    color: "#0284c7",
  },

  Sakit: {
    background: "#e0f2fe",
    color: "#0284c7",
  },
};

export default function StatusBadge({
  status,
}: StatusBadgeProps) {
  const style =
    STATUS_STYLES[status];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "4px 9px",
        borderRadius: "999px",
        backgroundColor:
          style.background,
        color: style.color,
        fontSize: "9px",
        lineHeight: 1.3,
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </span>
  );
}