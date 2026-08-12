"use client";

import StatusBadge from "./StatusBadge";

export interface AttendanceRecord {
  id: number | string;
  date: string;
  employeeName: string;
  checkIn: string | null;
  checkOut: string | null;
  lateMinutes: number | null;
  status: string;
}

interface AttendanceTableProps {
  data: AttendanceRecord[];
  loading?: boolean;
  error?: string | null;
}

const BORDER = "#f0ece3";
const HEADER_BG = "#fef3e2";
const HEADER_COLOR = "#e8a838";

export default function AttendanceTable({
  data,
  loading = false,
  error = null,
}: AttendanceTableProps) {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        overflow: "hidden",
        border: `1px solid ${BORDER}`,
        width: "100%",
      }}
    >
      <div
        style={{
          width: "100%",
          overflowX: "auto",
        }}
      >
        <table
          style={{
            width: "100%",
            minWidth: "800px",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: HEADER_BG }}>
              <th style={headerStyle}>Tanggal</th>
              <th style={headerStyle}>Nama Karyawan</th>
              <th style={headerStyle}>Waktu Masuk</th>
              <th style={headerStyle}>Waktu Keluar</th>
              <th style={headerStyle}>Keterlambatan</th>
              <th style={headerStyle}>Status Kehadiran</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={emptyStyle}>
                  Memuat data absensi...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    ...emptyStyle,
                    color: "#d32f2f",
                  }}
                >
                  {error}
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={6} style={emptyStyle}>
                  Belum ada data absensi.
                </td>
              </tr>
            ) : (
              data.map((row, index) => {
                const hasLate =
                  typeof row.lateMinutes === "number" &&
                  row.lateMinutes > 0;

                return (
                  <tr
                    key={`${row.id}-${index}`}
                    style={{
                      borderBottom: `1px solid ${BORDER}`,
                    }}
                  >
                    {/* Tanggal */}
                    <td style={cellStyle}>
                      {row.date || "-"}
                    </td>

                    {/* Nama Karyawan */}
                    <td style={cellStyle}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          minWidth: "180px",
                        }}
                      >
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            backgroundColor: "#e0e0e0",
                            flexShrink: 0,
                          }}
                        />

                        <span
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {row.employeeName || "Karyawan"}
                        </span>
                      </div>
                    </td>

                    {/* Waktu Masuk */}
                    <td style={cellStyle}>
                      {row.checkIn || "-"}
                    </td>

                    {/* Waktu Keluar */}
                    <td style={cellStyle}>
                      {row.checkOut || "-"}
                    </td>

                    {/* Keterlambatan */}
                    <td
                      style={{
                        ...cellStyle,
                        color: hasLate ? "#d32f2f" : "#999999",
                        fontWeight: hasLate ? 600 : 400,
                      }}
                    >
                      {hasLate
                        ? `${row.lateMinutes} mnt`
                        : "-"}
                    </td>

                    {/* Status */}
                    <td style={cellStyle}>
                      <StatusBadge
                        status={row.status || "Belum ada status"}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const headerStyle: React.CSSProperties = {
  padding: "14px 16px",
  textAlign: "left",
  fontSize: "13px",
  fontWeight: 600,
  color: HEADER_COLOR,
  whiteSpace: "nowrap",
};

const cellStyle: React.CSSProperties = {
  padding: "14px 16px",
  fontSize: "13px",
  color: "#333333",
  verticalAlign: "middle",
  whiteSpace: "nowrap",
};

const emptyStyle: React.CSSProperties = {
  padding: "48px 20px",
  textAlign: "center",
  color: "#999999",
  fontSize: "14px",
};