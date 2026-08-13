'use client';

import { useState, useEffect, useCallback } from 'react';
import API from '../../services/api';
import Sidebar from '../../components/Sidebar';
import { 
  Users, 
  Mail, 
  FileText, 
  Ban,
  Calendar
} from 'lucide-react';

interface AttendanceData {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  division?: string;
  position?: string;
  checkIn: string;
  checkOut: string;
  status: string;
  date: string;
}

interface SummaryData {
  hadir: number;
  izin: number;
  sakit: number;
  tidakHadir: number;
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<SummaryData>({ 
    hadir: 0, 
    izin: 0, 
    sakit: 0, 
    tidakHadir: 0 
  });
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState('');

  const fetchAttendanceData = useCallback(async () => {
    try {
      setLoading(true);
      
      const response = await API.get('/attendance');
      
      let data: AttendanceData[] = [];
      
      if (Array.isArray(response.data)) {
        data = response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        data = response.data.data;
      } else {
        console.error('Format data tidak dikenali:', response.data);
        data = [];
      }
      
      setAttendanceData(data);
      
      const counts: SummaryData = {
        hadir: 0,
        izin: 0,
        sakit: 0,
        tidakHadir: 0
      };

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
    } catch (error) {
      console.error('Gagal mengambil data absensi:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const today = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      setCurrentDate(today.toLocaleDateString('id-ID', options));

      void fetchAttendanceData();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [fetchAttendanceData]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fff' }}>
      <Sidebar />

      <main style={{ 
        marginLeft: '260px', 
        width: 'calc(100% - 260px)', 
        padding: '32px 40px' 
      }}>
        
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px'
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#333',
            margin: 0
          }}>
            Absensi Kehadiran Karyawan
          </h1>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#fff',
            padding: '8px 16px',
            borderRadius: '20px',
            border: '1px solid #f0f0f0'
          }}>
            <Calendar size={16} color="#e8a838" />
            <span style={{
              fontSize: '13px',
              color: '#e8a838',
              fontWeight: '500'
            }}>
              {currentDate}
            </span>
          </div>
        </div>

        {/* Summary Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
          marginBottom: '32px'
        }}>
          <SummaryCard 
            icon={<Users size={20} color="#4CAF50" />}
            count={loading ? '...' : summary.hadir}
            label="Hadir"
            iconBgColor="#E8F5E9"
          />
          <SummaryCard 
            icon={<Mail size={20} color="#2196F3" />}
            count={loading ? '...' : summary.izin}
            label="Izin"
            iconBgColor="#E3F2FD"
          />
          <SummaryCard 
            icon={<FileText size={20} color="#FFC107" />}
            count={loading ? '...' : summary.sakit}
            label="Sakit"
            iconBgColor="#FFF8E1"
          />
          <SummaryCard 
            icon={<Ban size={20} color="#F44336" />}
            count={loading ? '...' : summary.tidakHadir}
            label="Tidak hadir"
            iconBgColor="#FFEBEE"
          />
        </div>

        {/* Attendance Table */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#333',
            padding: '24px 24px 0 24px',
            marginBottom: '16px'
          }}>
            Detail kehadiran
          </h2>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
              Memuat data...
            </div>
          ) : attendanceData.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
              Belum ada data absensi.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse'
              }}>
                <thead>
                  <tr style={{ 
                    borderBottom: '2px solid #FFF3CD',
                    backgroundColor: '#FFF9E6'
                  }}>
                    <th style={{ padding: '12px 24px', textAlign: 'left', color: '#666', fontWeight: '600', fontSize: '14px' }}>Nama Karyawan</th>
                    <th style={{ padding: '12px 24px', textAlign: 'left', color: '#666', fontWeight: '600', fontSize: '14px' }}>Divisi</th>
                    <th style={{ padding: '12px 24px', textAlign: 'left', color: '#666', fontWeight: '600', fontSize: '14px' }}>Jabatan</th>
                    <th style={{ padding: '12px 24px', textAlign: 'left', color: '#666', fontWeight: '600', fontSize: '14px' }}>Waktu Masuk</th>
                    <th style={{ padding: '12px 24px', textAlign: 'left', color: '#666', fontWeight: '600', fontSize: '14px' }}>Waktu Keluar</th>
                    <th style={{ padding: '12px 24px', textAlign: 'left', color: '#666', fontWeight: '600', fontSize: '14px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((item, index) => (
                    <tr 
                      key={item.id} 
                      style={{ borderBottom: index < attendanceData.length - 1 ? '1px solid #f5f5f5' : 'none' }}
                    >
                      <td style={{ padding: '16px 24px', color: '#333', fontSize: '14px' }}>{item.userName}</td>
                      <td style={{ padding: '16px 24px', color: '#666', fontSize: '14px' }}>{item.division || 'Divisi I'}</td>
                      <td style={{ padding: '16px 24px', color: '#666', fontSize: '14px' }}>{item.position || 'Staff'}</td>
                      <td style={{ padding: '16px 24px', color: '#666', fontSize: '14px' }}>{item.checkIn || '-'}</td>
                      <td style={{ padding: '16px 24px', color: '#666', fontSize: '14px' }}>{item.checkOut || '-'}</td>
                      <td style={{ padding: '16px 24px', fontSize: '14px' }}>
                        <span style={{
                          backgroundColor: getStatusColor(item.status),
                          padding: '6px 16px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '500',
                          color: '#333',
                          display: 'inline-block'
                        }}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Komponen SummaryCard - Updated dengan colored bottom shadow
function SummaryCard({ 
  icon, 
  count, 
  label, 
  iconBgColor 
}: { 
  icon: React.ReactNode;
  count: string | number;
  label: string;
  iconBgColor: string;
}) {
  // Fungsi untuk mendapatkan warna shadow dari iconBgColor
  const getShadowColor = (bgColor: string) => {
    // Convert hex atau warna ke rgba dengan opacity rendah
    if (bgColor === '#E8F5E9') return 'rgba(76, 175, 80, 0.15)'; // Hijau untuk Hadir
    if (bgColor === '#E3F2FD') return 'rgba(33, 150, 243, 0.15)'; // Biru untuk Izin
    if (bgColor === '#FFF8E1') return 'rgba(255, 193, 7, 0.15)'; // Kuning untuk Sakit
    if (bgColor === '#FFEBEE') return 'rgba(244, 67, 54, 0.15)'; // Merah untuk Tidak hadir
    return 'rgba(0, 0, 0, 0.06)'; // Default
  };

  const shadowColor = getShadowColor(iconBgColor);

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      padding: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      // Colored bottom shadow
      boxShadow: `0 4px 12px ${shadowColor}, 0 2px 4px rgba(0,0,0,0.04)`,
      border: '1px solid #f5f5f5',
      transition: 'transform 0.2s, box-shadow 0.2s'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = `0 8px 20px ${shadowColor}, 0 4px 8px rgba(0,0,0,0.06)`;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = `0 4px 12px ${shadowColor}, 0 2px 4px rgba(0,0,0,0.04)`;
    }}
    >
      {/* Icon dengan background berwarna tipis */}
      <div style={{
        width: '44px',
        height: '44px',
        borderRadius: '10px',
        backgroundColor: iconBgColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        {icon}
      </div>
      
      {/* Angka dan Label */}
      <div>
        <div style={{
          fontSize: '28px',
          fontWeight: '700',
          color: '#333',
          lineHeight: 1,
          marginBottom: '4px'
        }}>
          {count}
        </div>
        <div style={{
          fontSize: '14px',
          color: '#888',
          fontWeight: '400'
        }}>
          {label}
        </div>
      </div>
    </div>
  );
}

// Helper function untuk status color
function getStatusColor(status: string): string {
  const s = status.toLowerCase();
  if (s === 'hadir' || s === 'terlambat') return '#E8F5E9';
  if (s === 'izin' || s === 'cuti') return '#E3F2FD';
  if (s === 'sakit') return '#FFF8E1';
  return '#FFEBEE';
}