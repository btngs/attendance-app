'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import SearchBar from '../../components/recap/SearchBar';
import AddButton from '../../components/karyawan/AddButton';
import EmployeeTable, { Employee } from '../../components/karyawan/EmployeeTable';

export default function KaryawanPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // ⚠️ Nanti data ini akan diisi dari database
  const [employeeData, setEmployeeData] = useState<Employee[]>([]);

  return (
    <main style={{ backgroundColor: '#f5f0e8', minHeight: '100vh' }}>
      <Navbar />
      
      <section style={{ 
        padding: '10px 60px 40px 60px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header dengan Search dan Tambah Anggota */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          gap: '16px',
          flexWrap: 'wrap'
        }}>
          <SearchBar 
            value={searchQuery}
            onChange={setSearchQuery}
          />
          
          <AddButton onClick={() => alert('Fitur tambah anggota belum tersedia')} />
        </div>

        {/* Tabel Karyawan - Saat ini kosong, nanti diisi dari database */}
        <EmployeeTable />
      </section>
    </main>
  );
}