'use client';

import { useState, useMemo } from 'react';
import Navbar from '../../components/Navbar';
import SearchBar from '../../components/recap/SearchBar';
import SortButton from '../../components/recap/SortButton';
import ExportButton from '../../components/recap/ExportButton';
import AttendanceTable from '../../components/recap/AttendanceTable';
import { mockAttendanceData } from '../../data/mockAttendanceData'; // Import data dummy

export default function RecapPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState('terbaru');

  // Logika Search (Filter data berdasarkan nama)
  const filteredData = useMemo(() => {
    return mockAttendanceData.filter(record => 
      record.employeeName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <main style={{ backgroundColor: '#fefefe', minHeight: '100vh' }}>
      <Navbar />
      
      <section style={{ 
        padding: '10px 60px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Header Controls */}
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
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <SortButton
              selectedSort={selectedSort}
              onSortChange={setSelectedSort}
            />
            <ExportButton />
          </div>
        </div>

        {/* Tabel */}
        <AttendanceTable data={filteredData} />
      </section>
    </main>
  );
}