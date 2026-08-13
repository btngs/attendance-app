"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Sidebar from "../../components/Sidebar";
import SearchBar from "../../components/recap/SearchBar";
import SortButton from "../../components/recap/SortButton";
import AttendanceTable from "../../components/recap/AttendanceTable";
import ExportButton from "../../components/recap/ExportButton";
import API from "../../services/api";
import { TABLE_COLUMNS } from "../../constants/rekapitulasi";

import type {
  RiwayatKehadiran,
  SortOption,
  StatusKehadiran,
} from "../../types/rekapitulasi";

const ATTENDANCE_ENDPOINT = "/attendance";

/* =========================================================
   RAW SHAPE RETURNED BY THE BACKEND
   (Field names differ depending on the endpoint, so every
   variant we might get back is accepted here.)
   ========================================================= */

interface ApiAttendanceRecord {
  id?: number | string;
  _id?: number | string;

  date?: string;
  tanggal?: string;
  attendance_date?: string;

  employeeName?: string;
  employee_name?: string;
  namaKaryawan?: string;
  name?: string;

  checkIn?: string | null;
  check_in?: string | null;
  waktuMasuk?: string | null;

  checkOut?: string | null;
  check_out?: string | null;
  waktuKeluar?: string | null;

  lateMinutes?: number | null;
  late_minutes?: number | null;
  keterlambatanMenit?: number | null;

  status?: string;
  attendance_status?: string;
}

/* =========================================================
   NORMALIZE STATUS -> StatusKehadiran
   ========================================================= */

function normalizeStatus(raw: string | undefined): StatusKehadiran {
  const value = (raw ?? "").trim().toLowerCase();

  if (value === "hadir" || value === "present" || value === "on time") {
    return "Hadir";
  }

  if (value === "terlambat" || value === "late") {
    return "Terlambat";
  }

  if (value === "izin" || value === "cuti" || value === "leave") {
    return "Izin";
  }

  if (value === "sakit" || value === "sick") {
    return "Sakit";
  }

  if (value === "wfh" || value === "work from home") {
    return "WFH";
  }

  return "Tidak hadir";
}

/* =========================================================
   NORMALIZE API DATA -> RiwayatKehadiran
   ========================================================= */

function normalizeAttendance(
  item: ApiAttendanceRecord,
  index: number,
): RiwayatKehadiran {
  return {
    id: item.id ?? item._id ?? index,

    tanggal: item.tanggal ?? item.date ?? item.attendance_date ?? "-",

    namaKaryawan:
      item.namaKaryawan ??
      item.employeeName ??
      item.employee_name ??
      item.name ??
      "Karyawan",

    waktuMasuk: item.waktuMasuk ?? item.checkIn ?? item.check_in ?? null,

    waktuKeluar: item.waktuKeluar ?? item.checkOut ?? item.check_out ?? null,

    keterlambatanMenit:
      item.keterlambatanMenit ?? item.lateMinutes ?? item.late_minutes ?? null,

    status: normalizeStatus(item.status ?? item.attendance_status),
  };
}

/* =========================================================
   EXTRACT API RESPONSE
   ========================================================= */

function extractAttendanceData(responseData: unknown): ApiAttendanceRecord[] {
  if (Array.isArray(responseData)) {
    return responseData as ApiAttendanceRecord[];
  }

  if (
    responseData &&
    typeof responseData === "object" &&
    "data" in responseData
  ) {
    const data = (responseData as { data?: unknown }).data;

    if (Array.isArray(data)) {
      return data as ApiAttendanceRecord[];
    }
  }

  return [];
}

/* =========================================================
   DATE HELPERS
   ========================================================= */

function getTimestamp(date: string): number {
  const timestamp = new Date(date).getTime();

  return Number.isNaN(timestamp) ? 0 : timestamp;
}

const SORT_RANGE_DAYS: Partial<Record<SortOption, number>> = {
  "7_hari_terakhir": 7,
  "1_bulan_terakhir": 30,
  "3_bulan_terakhir": 90,
};

function isWithinRange(timestamp: number, days: number): boolean {
  if (timestamp === 0) return false;

  const now = Date.now();
  const rangeStart = now - days * 24 * 60 * 60 * 1000;

  return timestamp >= rangeStart && timestamp <= now;
}

/* =========================================================
   EXPORT CSV
   ========================================================= */

function downloadCsv(data: RiwayatKehadiran[]) {
  const rows = data.map((item) => [
    item.tanggal,
    item.namaKaryawan,
    item.waktuMasuk ?? "-",
    item.waktuKeluar ?? "-",
    item.keterlambatanMenit !== null ? `${item.keterlambatanMenit} menit` : "-",
    item.status,
  ]);

  const csv = [TABLE_COLUMNS, ...rows]
    .map((row) =>
      row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","),
    )
    .join("\n");

  const blob = new Blob([`\uFEFF${csv}`], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `rekap-kehadiran-${new Date()
    .toISOString()
    .slice(0, 10)}.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/* =========================================================
   PAGE
   ========================================================= */

export default function RecapPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedSort, setSelectedSort] = useState<SortOption>("terbaru");

  const [attendanceData, setAttendanceData] = useState<RiwayatKehadiran[]>([]);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  /* =======================================================
     FETCH ATTENDANCE
     ======================================================= */

  const fetchAttendanceData = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await API.get(ATTENDANCE_ENDPOINT);

      const rawData = extractAttendanceData(response.data);

      const normalizedData = rawData.map(normalizeAttendance);

      setAttendanceData(normalizedData);
    } catch (error) {
      console.error("Gagal mengambil data rekap:", error);

      setErrorMessage("Data rekap gagal dimuat. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }, []);

  /* =======================================================
     INITIAL FETCH
     ======================================================= */

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchAttendanceData();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [fetchAttendanceData]);

  /* =======================================================
     SEARCH + SORT
     ======================================================= */

  const filteredAndSortedData = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();

    const rangeDays = SORT_RANGE_DAYS[selectedSort];

    const filtered = attendanceData.filter((record) => {
      const matchesKeyword = record.namaKaryawan
        .toLowerCase()
        .includes(keyword);

      if (!matchesKeyword) return false;

      if (rangeDays) {
        return isWithinRange(getTimestamp(record.tanggal), rangeDays);
      }

      return true;
    });

    return [...filtered].sort(
      (a, b) => getTimestamp(b.tanggal) - getTimestamp(a.tanggal),
    );
  }, [attendanceData, searchQuery, selectedSort]);

  /* =======================================================
     EXPORT
     ======================================================= */

  const handleExport = useCallback(() => {
    downloadCsv(filteredAndSortedData);
  }, [filteredAndSortedData]);

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#ffffff",
      }}
    >
      <Sidebar />

      <main
        style={{
          marginLeft: "260px",
          width: "calc(100% - 260px)",
          minHeight: "100vh",
          boxSizing: "border-box",
          padding: "34px 40px 48px",
        }}
      >
        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <header
          style={{
            marginBottom: "28px",
          }}
        >
          <h1
            style={{
              margin: 0,
              color: "#333333",
              fontSize: "24px",
              lineHeight: 1.3,
              fontWeight: 700,
              letterSpacing: "-0.2px",
            }}
          >
            Rekapitulasi
          </h1>

          <p
            style={{
              margin: "7px 0 0",
              color: "#8a8a8a",
              fontSize: "14px",
              lineHeight: 1.5,
            }}
          >
            Pantau dan kelola riwayat kehadiran karyawan.
          </p>
        </header>

        {/* =================================================
            TOOLBAR
        ================================================= */}

        <section
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            marginBottom: "18px",
            flexWrap: "wrap",
          }}
        >
          {/* SEARCH */}

          <div
            style={{
              flex: "1 1 280px",
              minWidth: "240px",
            }}
          >
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>

          {/* ACTIONS */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexShrink: 0,
            }}
          >
            <SortButton
              selectedSort={selectedSort}
              onSortChange={setSelectedSort}
            />

            <ExportButton
              onClick={handleExport}
              disabled={loading || filteredAndSortedData.length === 0}
            />
          </div>
        </section>

        {/* =================================================
            RESULT INFO
        ================================================= */}

        {!loading && !errorMessage && (
          <div
            style={{
              marginBottom: "12px",
              fontSize: "13px",
              color: "#999999",
            }}
          >
            Menampilkan{" "}
            <strong
              style={{
                color: "#666666",
                fontWeight: 600,
              }}
            >
              {filteredAndSortedData.length}
            </strong>{" "}
            data kehadiran
          </div>
        )}

        {/* =================================================
            ERROR MESSAGE
        ================================================= */}

        {errorMessage && (
          <div
            style={{
              marginBottom: "16px",
              padding: "14px 16px",
              borderRadius: "10px",
              border: "1px solid #fecaca",
              backgroundColor: "#fef2f2",
              color: "#b91c1c",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
            }}
          >
            <span>{errorMessage}</span>

            <button
              type="button"
              onClick={() => void fetchAttendanceData()}
              style={{
                border: "none",
                backgroundColor: "transparent",
                color: "#b91c1c",
                fontWeight: 600,
                fontSize: "13px",
                cursor: "pointer",
                padding: "4px 6px",
                flexShrink: 0,
              }}
            >
              Coba lagi
            </button>
          </div>
        )}

        {/* =================================================
            TABLE / LOADING
        ================================================= */}

        {loading ? (
          <div
            style={{
              border: "1px solid #f0ece3",
              borderRadius: "12px",
              backgroundColor: "#ffffff",
              padding: "52px 20px",
              textAlign: "center",
              color: "#888888",
              fontSize: "14px",
            }}
          >
            Memuat data rekapitulasi...
          </div>
        ) : errorMessage ? null : (
          <AttendanceTable data={filteredAndSortedData} />
        )}

        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {!loading && !errorMessage && filteredAndSortedData.length === 0 && (
          <div
            style={{
              marginTop: "12px",
              padding: "34px 20px",
              border: "1px solid #f0ece3",
              borderRadius: "12px",
              backgroundColor: "#ffffff",
              textAlign: "center",
              color: "#888888",
              fontSize: "14px",
            }}
          >
            {searchQuery.trim() ? (
              <>
                Tidak ada data kehadiran untuk{" "}
                <strong>&quot;{searchQuery}&quot;</strong>.
              </>
            ) : (
              "Belum ada data rekapitulasi."
            )}
          </div>
        )}
      </main>
    </div>
  );
}
