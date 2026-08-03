'use client';

import { useState, useMemo } from 'react';
import Navbar from '../../components/Navbar';
import SearchBar from '../../components/recap/SearchBar';
import AddButton from '../../components/karyawan/AddButton';
import EmployeeTable, { Employee } from '../../components/karyawan/EmployeeTable';

// ⚠️ DATA DUMMY SEMENTARA
const mockEmployees: Employee[] = [
  { id: '1', name: 'Denias Raditya', email: 'denias@gmail.com', role: 'Tetap' },
  { id: '2', name: 'Bintang Syahri', email: 'bintang@gmail.com', role: 'Magang' },
  { id: '3', name: 'Siti Aminah', email: 'siti@gmail.com', role: 'Kontrak' },
];

export default function KaryawanPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter data berdasarkan search
  const filteredData = useMemo(() => {
    return mockEmployees.filter(employee =>
      employee.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <main style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      <Navbar />
      <section style={{ padding: '10px 60px 40px 60px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', gap: '16px', flexWrap: 'wrap' }}>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <AddButton onClick={() => alert('Fitur tambah anggota akan segera hadir!')} />
        </div>

        <EmployeeTable data={filteredData} />
      </section>
    </main>
  );
}