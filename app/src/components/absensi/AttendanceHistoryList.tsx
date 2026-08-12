'use client';

export interface AttendanceRecord {
  id: string;
  date: string;
  status: string;
  checkIn: string;
  checkOut: string;
}

interface AttendanceHistoryListProps {
  records: AttendanceRecord[];
}

const statusColors: Record<string, string> = {
  hadir: '#16a34a',
  sakit: '#f59e0b',
  izin: '#3b82f6',
  'tidak-hadir': '#ef4444',
};

export default function AttendanceHistoryList({ records }: AttendanceHistoryListProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {records.map((record) => (
        <div
          key={record.id}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            padding: '14px 16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong style={{ color: '#1a1a1a' }}>{record.date}</strong>
            <span
              style={{
                backgroundColor: `${statusColors[record.status] || '#6b7280'}20`,
                color: statusColors[record.status] || '#6b7280',
                padding: '4px 8px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'capitalize',
              }}
            >
              {record.status}
            </span>
          </div>
          <div style={{ marginTop: '8px', fontSize: '13px', color: '#666' }}>
            Masuk: {record.checkIn} • Keluar: {record.checkOut}
          </div>
        </div>
      ))}
    </div>
  );
}
