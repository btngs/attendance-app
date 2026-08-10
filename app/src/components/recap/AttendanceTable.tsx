'use client';

import { useState, useEffect } from "react";
import API from "../../services/api"; // Helper Axios yang sudah disetting ke Express / Vercel

// Interface untuk tipe data absensi dari API
interface AttendanceRecord {
  id: number;
  name?: string;
  role: string;
  timeIn?: string;
  timeOut?: string;
  status: string; 
  jam_masuk?: string;
  jam_keluar?: string;
}

// Fungsi untuk menentukan warna badge status (Sesuai milik Anda)
function getStatusStyle(status: string) {
  const normalizedStatus = status?.toLowerCase();
  switch (normalizedStatus) {
    case "hadir":
      return { backgroundColor: "#e8f5e9", color: "#2e7d32" };
    case "tidak hadir":
    case "alpa":
      return { backgroundColor: "#fde8e8", color: "#c62828" };
    case "izin":
    case "cuti":
    case "sakit":
      return { backgroundColor: "#e3f2fd", color: "#1565c0" };
    default:
      return { backgroundColor: "#f5f5f5", color: "#666" };
  }
}

export default function AttendanceTable() {
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Mengambil data absensi dari backend Express/Vercel saat komponen dimuat
  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      // Memanggil endpoint GET /api/attendance
      const response = await API.get("/attendance");
      
      // Menyesuaikan struktur data response dari Express
      const data = response.data?.data || response.data || [];
      setAttendanceData(data);
    } catch (err: any) {
      console.error("Gagal mengambil data absensi:", err);
      setErrorMessage(
        err.response?.data?.message || "Gagal memuat data absensi dari server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      backgroundColor: "#ffffff", 
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
    }}>
      {/* Pesan Error jika API gagal dipanggil */}
      {errorMessage && (
        <div style={{
          padding: "12px 16px",
          backgroundColor: "#fde8e8",
          color: "#c62828",
          fontSize: "14px",
          borderBottom: "1px solid #f5c6cb"
        }}>
          {errorMessage}
        </div>
      )}

      <table style={{ 
        width: "100%", 
        borderCollapse: "collapse" 
      }}>
        {/* Header Tabel */}
        <thead>
          <tr style={{ backgroundColor: "#fef9e7" }}>            
            <th style={headerStyle}>Nama Karyawan</th>
            <th style={headerStyle}>Role</th>
            <th style={headerStyle}>Waktu Masuk</th>
            <th style={headerStyle}>Waktu Keluar</th>
            <th style={headerStyle}>Status</th>
            <th style={headerStyle}></th>
          </tr>
        </thead>

        {/* Body Tabel */}
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={7} style={{ ...cellStyle, textAlign: "center", color: "#888", padding: "24px" }}>
                Memuat data absensi...
              </td>
            </tr>
          ) : attendanceData.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ ...cellStyle, textAlign: "center", color: "#888", padding: "24px" }}>
                Belum ada data absensi.
              </td>
            </tr>
          ) : (
            attendanceData.map((row, index) => (
              <tr key={row.id || index} style={{ 
                borderBottom: "1px solid #f0f0f0" 
              }}>
                <td style={cellStyle}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {/* Avatar placeholder */}
                    <div style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      backgroundColor: "#e0e0e0"
                    }}></div>
                    {row.name || "Karyawan"}
                  </div>
                </td>
                <td style={cellStyle}>{row.role}</td>
                {/* Menyuasuaikan nama properti response jika dari MySQL/API (timeIn atau jam_masuk) */}
                <td style={cellStyle}>{row.timeIn || row.jam_masuk || "-"}</td>
                <td style={cellStyle}>{row.timeOut || row.jam_keluar || "-"}</td>
                <td style={cellStyle}>
                  <span style={{
                    ...getStatusStyle(row.status),
                    padding: "6px 16px",
                    borderRadius: "20px",
                    fontSize: "13px",
                    fontWeight: "500",
                    textTransform: "capitalize"
                  }}>
                    {row.status || "hadir"}
                  </span>
                </td>
                <td style={cellStyle}>
                  <button style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "18px",
                    color: "#999"
                  }}>
                    ⋮
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

const headerStyle: React.CSSProperties = {
  padding: "14px 16px",
  textAlign: "left",
  fontSize: "14px",
  fontWeight: "600",
  color: "#555"
};

const cellStyle: React.CSSProperties = {
  padding: "14px 16px",
  fontSize: "14px",
  color: "#333"
};