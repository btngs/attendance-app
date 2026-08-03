import StatusBadge from './StatusBadge';

interface AttendanceRecord {
  date: string;
  employeeId: string;
  employeeName: string;
  timeIn: string | null;
  timeOut: string | null;
  totalHours: string | null;
  lateDuration: string | null;
  status: string;
}

interface AttendanceTableProps {
  data: AttendanceRecord[];
}

export default function AttendanceTable({ data }: AttendanceTableProps) {

     if (data.length === 0) {
    return (
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '60px 20px',
        textAlign: 'center',
        color: '#999',
        fontSize: '16px'
      }}>
        Tidak ada data yang ditemukan
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      overflow: 'hidden'
    }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse'
      }}>
        <thead>
          <tr style={{ backgroundColor: '#fef9e7' }}>
            <th style={headerStyle}>Tanggal</th>
            <th style={headerStyle}>ID Karyawan</th>
            <th style={headerStyle}>Nama Karyawan</th>
            <th style={headerStyle}>Waktu Masuk</th>
            <th style={headerStyle}>Waktu Keluar</th>
            <th style={headerStyle}>Total jam kerja</th>
            <th style={headerStyle}>Keterlambatan</th>
            <th style={headerStyle}>Status kehadiran</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} style={{
              borderBottom: '1px solid #f0f0f0'
            }}>
              <td style={cellStyle}>{row.date}</td>
              <td style={cellStyle}>{row.employeeId}</td>
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
              <td style={cellStyle}>{row.timeIn || '-'}</td>
              <td style={cellStyle}>{row.timeOut || '-'}</td>
              <td style={cellStyle}>{row.totalHours || '-'}</td>
              <td style={{
                ...cellStyle,
                color: row.lateDuration && row.lateDuration !== '0 mnt' ? '#c62828' : '#333'
              }}>
                {row.lateDuration || '-'}
              </td>
              <td style={cellStyle}>
                <StatusBadge status={row.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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