"use client";

import type { CSSProperties } from "react";
import type { RiwayatKehadiran } from "../../types/rekapitulasi";

import StatusBadge from "./StatusBadge";

interface AttendanceTableProps {
  data: RiwayatKehadiran[];
  loading?: boolean;
}

const BORDER_COLOR = "#ebe9e2";
const HEADER_BACKGROUND = "#fef3e2";
const HEADER_COLOR = "#e8a838";
const TEXT_COLOR = "#333333";
const MUTED_COLOR = "#999999";

export default function AttendanceTable({
  data,
  loading = false,
}: AttendanceTableProps) {
  return (
    <div
      style={{
        width: "100%",
        overflowX: "auto",
        border: `1px solid ${BORDER_COLOR}`,
        borderRadius: "8px",
        backgroundColor: "#ffffff",
      }}
    >
      <table
        style={{
          width: "100%",
          minWidth: "780px",
          borderCollapse: "collapse",
          tableLayout: "fixed",
        }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: HEADER_BACKGROUND,
            }}
          >
            <th
              style={{
                ...headerStyle,
                width: "14%",
              }}
            >
              Tanggal
            </th>

            <th
              style={{
                ...headerStyle,
                width: "24%",
              }}
            >
              Nama Karyawan
            </th>

            <th
              style={{
                ...headerStyle,
                width: "14%",
              }}
            >
              Waktu Masuk
            </th>

            <th
              style={{
                ...headerStyle,
                width: "14%",
              }}
            >
              Waktu Keluar
            </th>

            <th
              style={{
                ...headerStyle,
                width: "16%",
              }}
            >
              Keterlambatan
            </th>

            <th
              style={{
                ...headerStyle,
                width: "18%",
              }}
            >
              Status Kehadiran
            </th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <LoadingRows />
          ) : data.length === 0 ? (
            <EmptyRow />
          ) : (
            data.map((record) => (
              <AttendanceRow key={record.id} record={record} />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

/* =========================================================
   ATTENDANCE ROW
========================================================= */

interface AttendanceRowProps {
  record: RiwayatKehadiran;
}

function AttendanceRow({ record }: AttendanceRowProps) {
  const hasLate =
    record.keterlambatanMenit !== null && record.keterlambatanMenit > 0;

  return (
    <tr
      style={{
        borderBottom: `1px solid ${BORDER_COLOR}`,
      }}
    >
      {/* TANGGAL */}

      <td style={cellStyle}>{record.tanggal || "-"}</td>

      {/* NAMA KARYAWAN */}

      <td style={cellStyle}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "9px",
            minWidth: 0,
          }}
        >
          <EmployeeAvatar name={record.namaKaryawan} />

          <span
            style={{
              color: TEXT_COLOR,
              fontSize: "11px",
              fontWeight: 500,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {record.namaKaryawan}
          </span>
        </div>
      </td>

      {/* WAKTU MASUK */}

      <td style={cellStyle}>{record.waktuMasuk || "-"}</td>

      {/* WAKTU KELUAR */}

      <td style={cellStyle}>{record.waktuKeluar || "-"}</td>

      {/* KETERLAMBATAN */}

      <td
        style={{
          ...cellStyle,
          color: hasLate ? "#dc2626" : MUTED_COLOR,
          fontWeight: hasLate ? 600 : 400,
        }}
      >
        {hasLate ? `${record.keterlambatanMenit} menit` : "-"}
      </td>

      {/* STATUS */}

      <td style={cellStyle}>
        <StatusBadge status={record.status} />
      </td>
    </tr>
  );
}

/* =========================================================
   EMPLOYEE AVATAR
========================================================= */

interface EmployeeAvatarProps {
  name: string;
}

function EmployeeAvatar({ name }: EmployeeAvatarProps) {
  const initial = name?.trim()?.charAt(0)?.toUpperCase() || "K";

  return (
    <div
      aria-hidden="true"
      style={{
        width: "28px",
        height: "28px",
        minWidth: "28px",
        borderRadius: "50%",
        backgroundColor: "#f1f1f1",
        color: "#777777",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "10px",
        fontWeight: 600,
      }}
    >
      {initial}
    </div>
  );
}

/* =========================================================
   LOADING
========================================================= */

function LoadingRows() {
  return (
    <tr>
      <td
        colSpan={6}
        style={{
          padding: "40px 20px",
          textAlign: "center",
          color: MUTED_COLOR,
          fontSize: "11px",
        }}
      >
        Memuat data kehadiran...
      </td>
    </tr>
  );
}

/* =========================================================
   EMPTY
========================================================= */

function EmptyRow() {
  return (
    <tr>
      <td
        colSpan={6}
        style={{
          padding: "40px 20px",
          textAlign: "center",
          color: MUTED_COLOR,
          fontSize: "11px",
        }}
      >
        Belum ada data kehadiran.
      </td>
    </tr>
  );
}

/* =========================================================
   STYLES
========================================================= */

const headerStyle: CSSProperties = {
  padding: "11px 12px",
  textAlign: "left",
  fontSize: "10px",
  lineHeight: 1.4,
  fontWeight: 600,
  color: HEADER_COLOR,
  whiteSpace: "nowrap",
};

const cellStyle: CSSProperties = {
  padding: "11px 12px",
  fontSize: "10px",
  lineHeight: 1.4,
  color: TEXT_COLOR,
  verticalAlign: "middle",
};
