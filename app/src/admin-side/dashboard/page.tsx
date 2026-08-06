'use client';

import { useState, useMemo } from 'react';
import Navbar from '../../components/Navbar';
import SummaryCard from '../../components/SummaryCard';
import AttendanceTable from '../../components/recap/AttendanceTable';

// ⚠️ DATA DUMMY SEMENTARA (Akan dihapus nanti saat API siap)
const mockSummary = { hadir: 12, izin: 2, sakit: 1, tidakHadir: 3 };
const mockAttendance = [
  { id: '1', date: '2026-08-03', employeeId: 'P-001', employeeName: 'Denias Raditya', role: 'Staff', timeIn: '08:00', timeOut: '17:00', status: 'hadir' },
  { id: '2', date: '2026-08-03', employeeId: 'P-002', employeeName: 'Bintang Syahri', role: 'Magang', timeIn: '08:15', timeOut: '17:00', status: 'terlambat' },
  { id: '3', date: '2026-08-03', employeeId: 'P-003', employeeName: 'Siti Aminah', role: 'Tetap', timeIn: null, timeOut: null, status: 'izin' },
];

export default function DashboardPage() {
  const [attendanceData] = useState(mockAttendance);
  const [summary] = useState(mockSummary);

  return (
    <main style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      <Navbar />
      <section style={{ padding: '20px 60px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ color: '#e8a838', fontSize: '26px', fontWeight: 'bold', marginBottom: '20px' }}>
          Absensi hari ini
        </h1>

        <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
          <SummaryCard icon="👥" count={summary.hadir} label="Hadir" bgColor="rgba(76, 175, 80, 0.3)" iconBgColor="#ffffff" />
          <SummaryCard icon="✉️" count={summary.izin} label="Izin" bgColor="rgba(33, 150, 243, 0.3)" iconBgColor="#ffffff" />
          <SummaryCard icon="📋" count={summary.sakit} label="Sakit" bgColor="rgba(255, 204, 0, 0.3)" iconBgColor="#ffffff" />
          <SummaryCard icon="⛔" count={summary.tidakHadir} label="Tidak/belum hadir" bgColor="rgba(244, 67, 54, 0.3)" iconBgColor="#ffffff" />
        </div>

        <AttendanceTable data={attendanceData} />
      </section>
    </main>
  );
}