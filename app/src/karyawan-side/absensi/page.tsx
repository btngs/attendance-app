'use client';

import { useState } from 'react';
import Sidebar from '../../components/karyawan-side/Sidebar';
import UserProfileCard from '../../components/absensi/UserProfileCard';
import ClockSection from '../../components/karyawan-side/ClockSection';
import FilterTabs from '../../components/absensi/FilterTabs';
import AttendanceHistoryList, { AttendanceRecord } from '../../components/absensi/AttendanceHistoryList';
import { ToastContainer } from '../../components/ui/Toast';
import { useToast } from '../../components/ui/useToast';

export default function KaryawanAbsensiPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false); // State menandai sudah scan masuk atau belum
  const [activeFilter, setActiveFilter] = useState('semua');
  const [isLoading, setIsLoading] = useState(false);
  
  const { toasts, showToast, dismissToast } = useToast();

  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([
    { id: '1', date: 'Senin, 3 Agustus', status: 'hadir', checkIn: '08:33', checkOut: '15:44' },
    { id: '2', date: 'Senin, 2 Agustus', status: 'hadir', checkIn: '08:33', checkOut: '15:44' },
    { id: '3', date: 'Senin, 2 Juli', status: 'izin', checkIn: '00:00', checkOut: '00:00' },
    { id: '4', date: 'Senin, 2 Juli', status: 'sakit', checkIn: '00:00', checkOut: '00:00' },
    { id: '5', date: 'Senin, 2 Juli', status: 'tidak-hadir', checkIn: '00:00', checkOut: '00:00' },
  ]);

  const stats = {
    hadir: 27,
    sakit: 3,
    izin: 2,
    absen: 33,
  };

  const filteredRecords = attendanceData.filter((record) => {
    if (activeFilter === 'semua') return true;
    return record.status === activeFilter;
  });

  // Handler Absen (Masuk / Keluar)
  async function handleToggleAbsen() {
    setIsLoading(true);
    try {
      if (!isCheckedIn) {
        // Alur Absen Masuk
        setIsCheckedIn(true);
        showToast('Absen masuk berhasil dikonfirmasi!', 'success');
      } else {
        // Alur Absen Keluar
        setIsCheckedIn(false);
        showToast('Absen keluar berhasil dikonfirmasi!', 'success');
      }
    } catch {
      showToast('Gagal memproses absensi.', 'error');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main style={{ backgroundColor: '#ffffff', minHeight: '100vh', position: 'relative' }}>
      {/* Background Curved Header Akses Oranye */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '160px',
          backgroundColor: '#FFF8E1',
          borderBottomLeftRadius: '32px',
          borderBottomRightRadius: '32px',
          zIndex: 0,
        }}
      />

      {/* Drawer Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '420px', margin: '0 auto', padding: '16px' }}>
        {/* Top Header dengan Icon Hamburger Menu (Tanpa Navbar Admin) */}
        <header style={{ marginBottom: '16px' }}>
          <button
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open Menu"
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              color: '#F5A623',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            ☰
          </button>
        </header>

        {/* Card Profil Karyawan */}
        <UserProfileCard
          name="Bintang Syahri Mahardika"
          role="Satpam"
          initials="BS"
          stats={stats}
        />

        {/* Section Jam Realtime + Tombol Dinamis (MASUK / KELUAR) */}
        <ClockSection
          isCheckIn={isCheckedIn}
          onToggleAbsen={handleToggleAbsen}
          isLoading={isLoading}
        />

        {/* Section Riwayat Absensi */}
        <section style={{ marginTop: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px', color: '#1a1a1a' }}>
            Riwayat absensi
          </h3>

          <FilterTabs activeFilter={activeFilter} onSelectFilter={setActiveFilter} />

          <AttendanceHistoryList records={filteredRecords} />
        </section>
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </main>
  );
}