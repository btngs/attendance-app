"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Sidebar from "../../components/Sidebar";
import SearchBar from "../../components/recap/SearchBar";
import SortButton from "../../components/recap/SortButton";
import AttendanceTable from "../../components/recap/AttendanceTable";
import API from "../../services/api";

const ATTENDANCE_ENDPOINT = "/attendance";

interface AttendanceRecord {
  id: number | string;
  date: string;
  employeeName: string;
  checkIn: string | null;
  checkOut: string | null;
  lateMinutes: number | null;
  status: string;
}

interface ApiAttendanceRecord {
  id?: number | string;
  date?: string;
  attendance_date?: string;

  employeeName?: string;
  employee_name?: string;
  name?: string;

  checkIn?: string | null;
  check_in?: string | null;

  checkOut?: string | null;
  check_out?: string | null;

  lateMinutes?: number | null;
  late_minutes?: number | null;

  status?: string;
  attendance_status?: string;
}

type SortType = "terbaru" | "terlama" | "nama";

/* =========================================================
   NORMALIZE API DATA
   ========================================================= */

function normalizeAttendance(
  item: ApiAttendanceRecord,
  index: number,
): AttendanceRecord {
  return {
    id: item.id ?? index,

    date: item.date ?? item.attendance_date ?? "-",

    employeeName:
      item.employeeName ?? item.employee_name ?? item.name ?? "Karyawan",

    checkIn: item.checkIn ?? item.check_in ?? null,

    checkOut: item.checkOut ?? item.check_out ?? null,

    lateMinutes: item.lateMinutes ?? item.late_minutes ?? null,

    status: item.status ?? item.attendance_status ?? "Belum ada status",
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
   DATE SORTING
   ========================================================= */

function getTimestamp(date: string): number {
  const timestamp = new Date(date).getTime();

  return Number.isNaN(timestamp) ? 0 : timestamp;
}

/* =========================================================
   EXPORT CSV
   ========================================================= */

function downloadCsv(data: AttendanceRecord[]) {
  const headers = [
    "Tanggal",
    "Nama Karyawan",
    "Waktu Masuk",
    "Waktu Keluar",
    "Keterlambatan",
    "Status Kehadiran",
  ];

  const rows = data.map((item) => [
    item.date,
    item.employeeName,
    item.checkIn ?? "-",
    item.checkOut ?? "-",
    item.lateMinutes !== null ? `${item.lateMinutes} menit` : "-",
    item.status,
  ]);

  const csv = [headers, ...rows]
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

  const [selectedSort, setSelectedSort] = useState<SortType>("terbaru");

  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);

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

    const filtered = attendanceData.filter((record) =>
      record.employeeName.toLowerCase().includes(keyword),
    );

    return [...filtered].sort((a, b) => {
      if (selectedSort === "nama") {
        return a.employeeName.localeCompare(b.employeeName, "id");
      }

      const dateA = getTimestamp(a.date);
      const dateB = getTimestamp(b.date);

      return selectedSort === "terbaru" ? dateB - dateA : dateA - dateB;
    });
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
              onSortChange={(value) => setSelectedSort(value as SortType)}
            />

            <button
              type="button"
              onClick={handleExport}
              disabled={loading || filteredAndSortedData.length === 0}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "40px",
                padding: "0 16px",
                borderRadius: "9px",
                border: "1px solid #e8a838",
                backgroundColor:
                  loading || filteredAndSortedData.length === 0
                    ? "#f5f5f5"
                    : "#fef3e2",
                color:
                  loading || filteredAndSortedData.length === 0
                    ? "#aaaaaa"
                    : "#e8a838",
                fontSize: "14px",
                fontWeight: 600,
                cursor:
                  loading || filteredAndSortedData.length === 0
                    ? "not-allowed"
                    : "pointer",
                transition:
                  "background-color 150ms ease, border-color 150ms ease",
              }}
              onMouseEnter={(event) => {
                if (!loading && filteredAndSortedData.length > 0) {
                  event.currentTarget.style.backgroundColor = "#fff3d6";
                }
              }}
              onMouseLeave={(event) => {
                if (!loading && filteredAndSortedData.length > 0) {
                  event.currentTarget.style.backgroundColor = "#fef3e2";
                }
              }}
            >
              Export
            </button>
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
