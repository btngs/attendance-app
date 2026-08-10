import { useEffect, useState } from 'react';
import ActionMenu from './ActionMenu';
import API from '../../services/api';

// Interface untuk data yang akan datang dari database nanti
export interface Employee {
  id: number | string;
  name: string;
  email: string;
  role: string;
}

interface EmployeeTableProps {
  data: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  onDataLoaded: (data: Employee[]) => void;
}

// Warna tema utama, disamakan dengan komponen lain di aplikasi
// (Navbar, AddButton, SearchBar, Dashboard) agar tampilan konsisten
const PRIMARY = '#e8a838';
const PRIMARY_LIGHT = '#fef3e2';
const BORDER = '#f0ece3';

// Warna hover baris, disamakan PERSIS dengan warna hover menu di Navbar
const ROW_HOVER_BG = '#FFF3D6';
const ROW_HOVER_ACCENT = '#F5A623';

// Fungsi untuk menentukan warna badge role
function getRoleStyle(role: string) {
  switch (role.toLowerCase()) {
    case 'tetap':
      return { backgroundColor: '#e8f5e9', color: '#2e7d32' };
    case 'magang':
      return { backgroundColor: '#e3f2fd', color: '#1565c0' };
    case 'kontrak':
      return { backgroundColor: PRIMARY_LIGHT, color: PRIMARY };
    default:
      return { backgroundColor: '#f5f5f5', color: '#666' };
  }
}

export default function EmployeeTable({ data, onEdit, onDelete, onDataLoaded }: EmployeeTableProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Baris yang sedang di-hover mouse, dan baris yang dropdown-nya sedang terbuka
  // (dropdown tetap terlihat walau mouse sudah geser, biar tidak tiba-tiba menghilang)
  const [hoveredRowId, setHoveredRowId] = useState<string | number | null>(null);
  const [openMenuRowId, setOpenMenuRowId] = useState<string | number | null>(null);

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  const fetchEmployeeData = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await API.get('/users');
      const fetchedData = response.data?.data || response.data || [];

      onDataLoaded(fetchedData);
    } catch (err: any) {
      console.error("Error fetching data: ", err);
      setErrorMessage(
        err.response?.data?.message || "error fetching data from server"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      overflow: 'visible',
      border: `1px solid ${BORDER}`
    }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse'
      }}>
        {/* Header Tabel - Selalu Terlihat */}
        <thead>
          <tr style={{ backgroundColor: PRIMARY_LIGHT }}>
            <th style={{ ...headerStyle, width: '60px' }}>No</th>
            <th style={headerStyle}>Nama Karyawan</th>
            <th style={headerStyle}>Email</th>
            <th style={headerStyle}>Role</th>
            <th style={{ ...headerStyle, width: '48px' }}></th>
          </tr>
        </thead>

        {/* Body Tabel */}
        <tbody>
          {loading ? (
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
                Memuat data karyawan...
              </td>
            </tr>
          ) : errorMessage ? (
            <tr>
              <td
                colSpan={5}
                style={{
                  padding: '40px 20px',
                  textAlign: 'center',
                  color: '#d32f2f',
                  fontSize: '14px'
                }}
              >
                {errorMessage}
              </td>
            </tr>
          ) : data.length === 0 ? (
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
                Belum ada data karyawan
              </td>
            </tr>
          ) : (
            // Jika ada data, tampilkan semua baris
            data.map((employee, index) => {
              const isRowActive = hoveredRowId === employee.id || openMenuRowId === employee.id;

              return (
                <tr
                  key={employee.id}
                  onMouseEnter={() => setHoveredRowId(employee.id)}
                  onMouseLeave={() => setHoveredRowId(null)}
                  style={{
                    borderBottom: `1px solid ${BORDER}`,
                    backgroundColor: isRowActive ? ROW_HOVER_BG : 'transparent',
                    boxShadow: isRowActive ? `inset 0 0 0 1px ${ROW_HOVER_ACCENT}33` : 'none',
                    transition: 'background-color 150ms ease, box-shadow 150ms ease',
                  }}
                >
                  <td style={{ ...cellStyle, color: '#999' }}>{index + 1}</td>
                  <td style={cellStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {/* Avatar placeholder */}
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: '#e0e0e0',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        flexShrink: 0
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
                    <div
                      style={{
                        opacity: isRowActive ? 1 : 0,
                        transition: 'opacity 150ms ease',
                        display: 'flex',
                        justifyContent: 'flex-end',
                      }}
                    >
                      <ActionMenu
                        onEdit={() => onEdit(employee)}
                        onDelete={() => onDelete(employee)}
                        onOpenChange={(isOpen) => setOpenMenuRowId(isOpen ? employee.id : null)}
                      />
                    </div>
                  </td>
                </tr>
              );
            })
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
  color: PRIMARY
};

const cellStyle: React.CSSProperties = {
  padding: '14px 16px',
  fontSize: '14px',
  color: '#333'
};