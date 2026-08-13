'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer } from '../../components/ui/Toast';
import { useToast } from '../../components/ui/useToast';
import API from '../../services/api';
import {
  belongsToUser,
  extractAttendanceArray,
  formatMonthYear,
  formatShortDate,
  getRecordCheckIn,
  getRecordCheckOut,
  getRecordDate,
  normalizeSimpleStatus,
} from '../../utils/attendance';

const ATTENDANCE_ENDPOINT = '/attendance';

export interface AttendanceRecord {
  id: string;
  date: string;
  monthYear: string;
  status: 'hadir' | 'sakit' | 'izin' | 'tidak-hadir';
  checkIn: string;
  checkOut: string;
}

interface StoredUser {
  id: string;
  name: string;
}

function getStoredUser(): StoredUser | null {
  if (typeof window === 'undefined') return null;

  const raw = localStorage.getItem('user');
  if (!raw) return null;

  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

type FilterOption = 'semua' | 'hadir' | 'sakit' | 'izin' | 'tidak-hadir';

export default function RiwayatAbsensiPage() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>('semua');
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const { toasts, showToast, dismissToast } = useToast();

  /* =======================================================
     FETCH THIS USER'S ATTENDANCE HISTORY
     ======================================================= */

  const fetchHistory = useCallback(async () => {
    const user = getStoredUser();

    if (!user) {
      setErrorMessage('Sesi tidak ditemukan. Silakan login kembali.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');

      const response = await API.get(ATTENDANCE_ENDPOINT);
      const rawRecords = extractAttendanceArray(response.data);

      const myRecords = rawRecords.filter((record) =>
        belongsToUser(record, user.id, user.name),
      );

      const mapped: AttendanceRecord[] = myRecords.map((record, index) => {
        const rawDate = getRecordDate(record);

        return {
          id: String(record.id ?? record._id ?? index),
          date: formatShortDate(rawDate),
          monthYear: formatMonthYear(rawDate),
          status: normalizeSimpleStatus(record.status ?? record.attendance_status),
          checkIn: getRecordCheckIn(record) || '00:00',
          checkOut: getRecordCheckOut(record) || '00:00',
        };
      });

      setRecords(mapped);
    } catch (error) {
      console.error('Gagal mengambil riwayat absensi:', error);
      setErrorMessage('Riwayat absensi gagal dimuat. Silakan coba lagi.');
      showToast('Gagal memuat riwayat absensi.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchHistory();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [fetchHistory]);

  // Filter Data
  const filteredRecords = records.filter((item) => {
    return selectedFilter === 'semua' || item.status === selectedFilter;
  });

  // Grouping data berdasarkan bulan & tahun
  const groupedRecords = filteredRecords.reduce<Record<string, AttendanceRecord[]>>((acc, item) => {
    if (!acc[item.monthYear]) acc[item.monthYear] = [];
    acc[item.monthYear].push(item);
    return acc;
  }, {});

  const filterOptions: { key: FilterOption; label: string }[] = [
    { key: 'semua', label: 'Semua' },
    { key: 'sakit', label: 'Sakit' },
    { key: 'izin', label: 'Izin' },
    { key: 'tidak-hadir', label: 'Tidak hadir' },
  ];

  // Helper status style
  const getStatusStyles = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'hadir':
        return {
          dotBg: '#2ecc71',
          iconBg: '#e8f8f0',
          textColor: '#2ecc71',
          label: 'Hadir',
          icon: 'H'
        };
      case 'izin':
        return {
          dotBg: '#3498db',
          iconBg: '#eaf2fd',
          textColor: '#3498db',
          label: 'Izin',
          icon: 'I'
        };
      case 'sakit':
        return {
          dotBg: '#f1c40f',
          iconBg: '#fef5e7',
          textColor: '#f39c12',
          label: 'Sakit',
          icon: 'S'
        };
      case 'tidak-hadir':
      default:
        return {
          dotBg: '#f1c40f',
          iconBg: '#fdedec',
          textColor: '#e74c3c',
          label: 'Tidak hadir',
          icon: 'T'
        };
    }
  };

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', padding: '20px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        {/* Header Arrow Back & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <button
            onClick={() => router.push('/src/karyawan-side/absensi')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Kembali ke Beranda"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#111827"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <h1 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
            Riwayat absensi
          </h1>
        </div>

        {/* Filter Chips */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '16px',
            marginBottom: '16px'
          }}
        >
          {filterOptions.map((opt) => {
            const isActive = selectedFilter === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() => setSelectedFilter(opt.key)}
                style={{
                  padding: '6px 16px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  border: isActive ? '1px solid #f39c12' : '1px solid #e5e7eb',
                  backgroundColor: isActive ? '#f39c12' : '#ffffff',
                  color: isActive ? '#ffffff' : '#6b7280',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s'
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Attendance List */}
        {loading ? (
          <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '13px', padding: '20px 0' }}>
            Memuat riwayat absensi...
          </p>
        ) : errorMessage ? (
          <div
            style={{
              padding: '14px 16px',
              borderRadius: '10px',
              border: '1px solid #fecaca',
              backgroundColor: '#fef2f2',
              color: '#b91c1c',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <span>{errorMessage}</span>
            <button
              type="button"
              onClick={() => void fetchHistory()}
              style={{
                border: 'none',
                backgroundColor: 'transparent',
                color: '#b91c1c',
                fontWeight: 600,
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              Coba lagi
            </button>
          </div>
        ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {Object.keys(groupedRecords).length === 0 ? (
            <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '13px', padding: '20px 0' }}>
              Tidak ada data riwayat absensi.
            </p>
          ) : (
            Object.entries(groupedRecords).map(([monthYear, items]) => (
            <div key={monthYear}>
            <h2 style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '12px', fontWeight: '500' }}>
            {monthYear}</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {items.map((item) => {
                    const style = getStatusStyles(item.status);

                    return (
                      <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {/* Dot Status Indicator */}
                        <div
                          style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: style.dotBg,
                            flexShrink: 0
                          }}
                        />

                        {/* Card Details */}
                        <div
                          style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px',
                            border: '1px solid #f3f4f6',
                            borderRadius: '12px',
                            backgroundColor: '#ffffff'
                          }}
                        >
                          {/* Left Icon & Text */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div
                              style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                backgroundColor: style.iconBg,
                                color: style.textColor,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                fontSize: '16px'
                              }}
                            >
                              {style.icon}
                            </div>
 <div>
                              <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#1f2937' }}>
                                {item.date}
                              </div>
                              <div style={{ fontSize: '11px', fontWeight: '600', color: style.textColor }}>
                                {style.label}
      </div>
   </div>
</div>

     {/* Right Clock Details */}
    <div style={{ textAlign: 'right', fontSize: '11px', color: '#6b7280', lineHeight: '1.4' }}>
    <div>
        Masuk <strong style={{ color: '#111827' }}>{item.checkIn}</strong>
        </div>
        <div>
        Keluar <strong style={{ color: '#111827' }}>{item.checkOut}</strong>
    </div>
    </div>
    </div>
</div>
);
    })}
    </div>
    </div>
))
)}
</div>
)}
</div>
<ToastContainer toasts={toasts} onDismiss={dismissToast} />
</div>
  );
}
