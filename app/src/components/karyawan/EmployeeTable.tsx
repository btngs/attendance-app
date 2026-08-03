// Interface untuk data yang akan datang dari database nanti
export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface EmployeeTableProps {
  data: Employee[];
}

// Fungsi untuk menentukan warna badge role
function getRoleStyle(role: string) {
  switch (role.toLowerCase()) {
    case 'tetap':
      return { backgroundColor: '#e8f5e9', color: '#2e7d32' };
    case 'magang':
      return { backgroundColor: '#e3f2fd', color: '#1565c0' };
    case 'kontrak':
      return { backgroundColor: '#fff9e6', color: '#f59e0b' };
    default:
      return { backgroundColor: '#f5f5f5', color: '#666' };
  }
}

export default function EmployeeTable({ data }: EmployeeTableProps) {
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
        {/* Header Tabel - Selalu Terlihat */}
        <thead>
          <tr style={{ backgroundColor: '#fef9e7' }}>
            <th style={headerStyle}>Nama Karyawan</th>
            <th style={headerStyle}>Email</th>
            <th style={headerStyle}>Role</th>
            <th style={headerStyle}></th>
          </tr>
        </thead>

        {/* Body Tabel */}
        <tbody>
          {data.length === 0 ? (
            // Jika data kosong, tampilkan pesan di dalam tabel
            <tr>
              <td
                colSpan={4}
                style={{
                  padding: '40px 20px',
                  textAlign: 'center',
                  color: '#999',
                  fontSize: '14px'
                }}
              >
                Belum ada data karyawan
              </td>
            </tr>
          ) : (
            // Jika ada data, tampilkan semua baris
            data.map((employee) => (
              <tr key={employee.id} style={{
                borderBottom: '1px solid #f0f0f0'
              }}>
                <td style={cellStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Avatar placeholder */}
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: '#e0e0e0'
                    }}></div>
                    {employee.name}
                  </div>
                </td>
                <td style={cellStyle}>{employee.email}</td>
                <td style={cellStyle}>
                  <span style={{
                    ...getRoleStyle(employee.role),
                    padding: '6px 16px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: '500',
                    display: 'inline-block'
                  }}>
                    {employee.role}
                  </span>
                </td>
                <td style={cellStyle}>
                  <button style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '18px',
                    color: '#999'
                  }}>
                    
                  </button>
                </td>
              </tr>
            ))
          )}
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