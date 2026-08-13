"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Sidebar from "../../components/karyawan-side/Sidebar";
import UserProfileCard from "../../components/absensi/UserProfileCard";
import ClockSection from "../../components/karyawan-side/ClockSection";
import FilterTabs from "../../components/absensi/FilterTabs";
import AttendanceHistoryList, {
  AttendanceRecord,
} from "../../components/absensi/AttendanceHistoryList";
import { ToastContainer } from "../../components/ui/Toast";
import { useToast } from "../../components/ui/useToast";
import API from "../../services/api";
import {
  belongsToUser,
  extractAttendanceArray,
  formatShortDate,
  getRecordCheckIn,
  getRecordCheckOut,
  getRecordDate,
  isToday,
  normalizeSimpleStatus,
} from "../../utils/attendance";

const ATTENDANCE_ENDPOINT = "/attendance";

interface StoredUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

function getStoredUser(): StoredUser | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem("user");
  if (!raw) return null;

  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "K";

  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

export default function KaryawanAbsensiPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [activeFilter, setActiveFilter] = useState("semua");
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);

  const [user, setUser] = useState<StoredUser | null>(null);
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);

  const { toasts, showToast, dismissToast } = useToast();

  /* =======================================================
     LOAD LOGGED-IN USER
     ======================================================= */

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setUser(getStoredUser());
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  /* =======================================================
     FETCH THIS USER'S ATTENDANCE HISTORY
     ======================================================= */

  const fetchHistory = useCallback(
    async (currentUser: StoredUser) => {
      try {
        setIsHistoryLoading(true);

        const response = await API.get(ATTENDANCE_ENDPOINT);
        const rawRecords = extractAttendanceArray(response.data);

        const myRecords = rawRecords.filter((record) =>
          belongsToUser(record, currentUser.id, currentUser.name),
        );

        const mapped: AttendanceRecord[] = myRecords.map((record, index) => ({
          id: String(record.id ?? record._id ?? index),
          date: formatShortDate(getRecordDate(record)),
          status: normalizeSimpleStatus(
            record.status ?? record.attendance_status,
          ),
          checkIn: getRecordCheckIn(record) || "00:00",
          checkOut: getRecordCheckOut(record) || "00:00",
        }));

        setAttendanceData(mapped);

        // Figure out whether the user is currently clocked in: today's
        // record has a check-in time but no check-out time yet.
        const todaysRecord = myRecords.find((record) =>
          isToday(getRecordDate(record)),
        );
        const hasCheckedInToday = Boolean(
          todaysRecord && getRecordCheckIn(todaysRecord),
        );
        const hasCheckedOutToday = Boolean(
          todaysRecord && getRecordCheckOut(todaysRecord),
        );

        setIsCheckedIn(hasCheckedInToday && !hasCheckedOutToday);
      } catch (error) {
        console.error("Gagal mengambil riwayat absensi:", error);
        showToast("Gagal memuat riwayat absensi.", "error");
      } finally {
        setIsHistoryLoading(false);
      }
    },
    [showToast],
  );

  useEffect(() => {
    if (!user) return;

    const timer = window.setTimeout(() => {
      void fetchHistory(user);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [user, fetchHistory]);

  /* =======================================================
     STATS (derived from real history, not hardcoded)
     ======================================================= */

  const stats = useMemo(
    () => ({
      hadir: attendanceData.filter((r) => r.status === "hadir").length,
      sakit: attendanceData.filter((r) => r.status === "sakit").length,
      izin: attendanceData.filter((r) => r.status === "izin").length,
      absen: attendanceData.filter((r) => r.status === "tidak-hadir").length,
    }),
    [attendanceData],
  );

  const filteredRecords = attendanceData.filter((record) => {
    if (activeFilter === "semua") return true;
    return record.status === activeFilter;
  });

  /* =======================================================
     CHECK-IN / CHECK-OUT
     ======================================================= */

  async function handleToggleAbsen() {
    if (!user) return;

    setIsLoading(true);
    try {
      if (!isCheckedIn) {
        await API.post("/attendance/check-in");
        setIsCheckedIn(true);
        showToast("Absen masuk berhasil dikonfirmasi!", "success");
      } else {
        await API.post("/attendance/check-out");
        setIsCheckedIn(false);
        showToast("Absen keluar berhasil dikonfirmasi!", "success");
      }

      void fetchHistory(user);
    } catch (error) {
      console.error("Gagal memproses absensi:", error);
      showToast("Gagal memproses absensi.", "error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main
      style={{
        backgroundColor: "#ffffff",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      {/* Background Curved Header Akses Oranye */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "160px",
          backgroundColor: "#FFF8E1",
          borderBottomLeftRadius: "32px",
          borderBottomRightRadius: "32px",
          zIndex: 0,
        }}
      />

      {/* Drawer Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "420px",
          margin: "0 auto",
          padding: "16px",
        }}
      >
        {/* Top Header dengan Icon Hamburger Menu (Tanpa Navbar Admin) */}
        <header style={{ marginBottom: "16px" }}>
          <button
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open Menu"
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              color: "#F5A623",
              cursor: "pointer",
              padding: "4px",
            }}
          >
            ☰
          </button>
        </header>

        {/* Card Profil Karyawan */}
        <UserProfileCard
          name={user?.name ?? "Karyawan"}
          role={user?.role ?? "-"}
          initials={getInitials(user?.name ?? "Karyawan")}
          stats={stats}
        />

        {/* Section Jam Realtime + Tombol Dinamis (MASUK / KELUAR) */}
        <ClockSection
          isCheckIn={isCheckedIn}
          onToggleAbsen={handleToggleAbsen}
          isLoading={isLoading}
        />

        {/* Section Riwayat Absensi */}
        <section style={{ marginTop: "20px" }}>
          <h3
            style={{
              fontSize: "15px",
              fontWeight: 600,
              marginBottom: "12px",
              color: "#1a1a1a",
            }}
          >
            Riwayat absensi
          </h3>

          <FilterTabs
            activeFilter={activeFilter}
            onSelectFilter={setActiveFilter}
          />

          {isHistoryLoading ? (
            <p
              style={{
                textAlign: "center",
                color: "#9ca3af",
                fontSize: "13px",
                padding: "20px 0",
              }}
            >
              Memuat riwayat absensi...
            </p>
          ) : filteredRecords.length === 0 ? (
            <p
              style={{
                textAlign: "center",
                color: "#9ca3af",
                fontSize: "13px",
                padding: "20px 0",
              }}
            >
              Belum ada riwayat absensi.
            </p>
          ) : (
            <AttendanceHistoryList records={filteredRecords} />
          )}
        </section>
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </main>
  );
}
