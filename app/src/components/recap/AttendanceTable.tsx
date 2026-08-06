'use client';

import { useState } from 'react';

interface AttendanceRecord {
  id: string;
  date: string;
  employeeId: string;
  employeeName: string;
  role: string;
  timeIn: string | null;
  timeOut: string | null;
  status: string;
}

interface AttendanceTableProps {
  data?: AttendanceRecord[];
}

// Fungsi untuk menentukan warna badge status
function getStatusStyle(status: string) {
  switch (status.toLowerCase()) {
    case 'hadir':
      return { backgroundColor: '#e8f5e9', color: '#2e7d32' };
    case 'tidak hadir':
      return { backgroundColor: '#fde8e8', color: '#c62828' };
    case 'terlambat':
      return { backgroundColor: '#fff9e6', color: '#f59e0b' };
    case 'izin':
    case 'wfh':
    case 'sakit':
      return { backgroundColor: '#e3f2fd', color: '#1565c0' };
    default:
      return { backgroundColor: '#f5f5f5', color: '#666' };
  }
}

const ITEMS_PER_PAGE = 7;

export default function AttendanceTable({ data = [] }: AttendanceTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Hitung total halaman
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  // Ambil data untuk halaman saat ini
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentData = data.slice(startIndex, endIndex);

  return (
    <div>
      {/* Tabel */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse'
        }}>
          {/* Header Tabel - Selalu Terlihat */}
          <thead>
            <tr style={{ backgroundColor: '#fef9e7' }}>
              <th style={headerStyle}>Nama Karyawan</th>
              <th style={headerStyle}>Role</th>
              <th style={headerStyle}>Waktu Masuk</th>
              <th style={headerStyle}>Waktu Keluar</th>
              <th style={headerStyle}>Status</th>
            </tr>
          </thead>

          {/* Body Tabel */}
          <tbody>
            {currentData.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  style={{
                    padding: '40px 20px',
                    textAlign: 'center',
                    color: '#999',
                    fontSize: '14px'
                  }}
                >
                  Belum ada data absensi
                </td>
              </tr>
            ) : (
              currentData.map((row, index) => (
                <tr key={row.id || index} style={{
                  borderBottom: '1px solid #f0f0f0'
                }}>
                  <td style={cellStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: '#e0e0e0'
                      }}></div>
                      {row.employeeName}
                    </div>
                  </td>
                  <td style={cellStyle}>{row.role || '-'}</td>
                  <td style={cellStyle}>{row.timeIn || '-'}</td>
                  <td style={cellStyle}>{row.timeOut || '-'}</td>
                  <td style={cellStyle}>
                    <span style={{
                      ...getStatusStyle(row.status),
                      padding: '6px 16px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: '500',
                      display: 'inline-block'
                    }}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination - Hanya muncul jika data lebih dari 7 */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '8px',
          marginTop: '20px'
        }}>
          {/* Tombol Previous */}
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={{
              ...pageButtonStyle,
              opacity: currentPage === 1 ? 0.5 : 1,
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            &lt;
          </button>

          {/* Nomor Halaman */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              style={{
                ...pageButtonStyle,
                backgroundColor: currentPage === page ? '#e8a838' : 'white',
                color: currentPage === page ? 'white' : '#333',
                border: currentPage === page ? '1px solid #e8a838' : '1px solid #ddd'
              }}
            >
              {page}
            </button>
          ))}

          {/* Tombol Next */}
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={{
              ...pageButtonStyle,
              opacity: currentPage === totalPages ? 0.5 : 1,
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
            }}
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
}

const headerStyle: React.CSSProperties = {
  padding: '14px 16px',
  textAlign: 'left',
  fontSize: '14px',
  fontWeight: '600',
  color: '#555'
};

const cellStyle: React.CSSProperties = {
  padding: '14px 16px',
  fontSize: '14px',
  color: '#333'
};

const pageButtonStyle: React.CSSProperties = {
  padding: '6px 12px',
  border: '1px solid #ddd',
  borderRadius: '6px',
  backgroundColor: 'white',
  fontSize: '14px',
  fontWeight: '500'
};