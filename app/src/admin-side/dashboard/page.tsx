'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import SummaryCard from '../../components/SummaryCard';
import AttendanceTable from '../../components/recap/AttendanceTable';

export default function DashboardPage() {
  const [summary, setSummary] = useState({ hadir: 0, izin: 0, sakit: 0, tidakHadir: 0 });
  const [loading, setLoading] = useState(true);

  // Menerima data hasil fetch dari komponen AttendanceTable
  const handleDataLoaded = (data: any[]) => {
    const counts = { hadir: 0, izin: 0, sakit: 0, tidakHadir: 0 };

    data.forEach((item) => {
      const status = (item.status || '').toLowerCase();
      if (status === 'hadir' || status === 'terlambat') {
        counts.hadir += 1;
      } else if (status === 'izin' || status === 'cuti' || status === 'wfh') {
        counts.izin += 1;
      } else if (status === 'sakit') {
        counts.sakit += 1;
      } else if (status === 'tidak hadir' || status === 'alpa') {
        counts.tidakHadir += 1;
      }
    });

    setSummary(counts);
    setLoading(false);
  };

  return (
    <main style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      <Navbar />
      <section style={{ padding: '20px 60px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ color: '#e8a838', fontSize: '26px', fontWeight: 'bold', marginBottom: '20px' }}>
          Absensi hari ini
        </h1>

        {/* Card Summary (Terganti Otomatis saat data tabel siap) */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
          <SummaryCard icon="👥" count={loading ? '...' : summary.hadir} label="Hadir" bgColor="rgba(76, 175, 80, 0.3)" iconBgColor="#ffffff" />
          <SummaryCard icon="✉️" count={loading ? '...' : summary.izin} label="Izin" bgColor="rgba(33, 150, 243, 0.3)" iconBgColor="#ffffff" />
          <SummaryCard icon="📋" count={loading ? '...' : summary.sakit} label="Sakit" bgColor="rgba(255, 204, 0, 0.3)" iconBgColor="#ffffff" />
          <SummaryCard icon="⛔" count={loading ? '...' : summary.tidakHadir} label="Tidak/belum hadir" bgColor="rgba(244, 67, 54, 0.3)" iconBgColor="#ffffff" />
        </div>

        {/* Panggil komponen tabel langsung tanpa prop data */}
        {/* Cast props to any to satisfy TypeScript if AttendanceTable has no declared props */}
        <AttendanceTable {...({ onDataLoaded: handleDataLoaded } as any)} />
      </section>
    </main>
  );
}