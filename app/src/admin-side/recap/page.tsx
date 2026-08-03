'use client';

import { useState, useMemo } from 'react';
import Navbar from '../../components/Navbar';
import SearchBar from '../../components/recap/SearchBar';
import SortButton from '../../components/recap/SortButton';
import ExportButton from '../../components/recap/ExportButton';
import AttendanceTable from '../../components/recap/AttendanceTable';

// ⚠️ DATA DUMMY SEMENTARA (Buat tes pagination & search)
const mockAttendance = Array.from({ length: 15 }, (_, i) => ({
  id: `EMP-${i + 1}`,
  date: '2026-08-03',
  employeeId: `P-00${i + 1}`,
  employeeName: `Karyawan Contoh ${i + 1}`,
  role: i % 2 === 0 ? 'Tetap' : 'Magang',
  timeIn: '08:00',
  timeOut: '17:00',
  status: i % 3 === 0 ? 'terlambat' : 'hadir'
}));

export default function RecapPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState('terbaru');

  // Filter data berdasarkan search (Fitur ini tetap jalan!)
  const filteredData = useMemo(() => {
    return mockAttendance.filter(record =>
      record.employeeName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <main style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      <Navbar />
      <section style={{ padding: '10px 60px 40px 60px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', gap: '16px', flexWrap: 'wrap' }}>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <div style={{ display: 'flex', gap: '12px' }}>
            <SortButton selectedSort={selectedSort} onSortChange={setSelectedSort} />
            <ExportButton />
          </div>
        </div>

        <AttendanceTable data={filteredData} />
      </section>
    </main>
  );
}