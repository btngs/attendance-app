import React, { useState, useEffect } from 'react';
import { getAllUsers } from "../../services/api";

export interface Employee {
  id: string | number;
  name: string;
  email: string;
  role: string;
}

function getRoleStyle(role: string | undefined | null) {
  const safeRole = (role || '').toLowerCase();

  switch (safeRole) {
    case 'tetap':
    case 'karyawan':
      return { backgroundColor: '#e8f5e9', color: '#2e7d32' };
    case 'magang':
      return { backgroundColor: '#e3f2fd', color: '#1565c0' };
    case 'kontrak':
      return { backgroundColor: '#fff9e6', color: '#f59e0b' };
    default:
      return { backgroundColor: '#f5f5f5', color: '#666' };
  }
}

function getInitial(name: string) {
  return name ? name.charAt(0).toUpperCase() : '?';
}

export default function EmployeeTable() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getAllUsers();
        const userList = response?.data || response || [];
        setEmployees(userList);
      } catch (err: any) {
        console.error("Gagal mengambil data karyawan:", err);
        setError(err.message || "Gagal memuat data dari server");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      overflow: 'hidden',
      border: '1px solid #f0f0f0'
    }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse'
      }}>
        <thead>
          <tr style={{ backgroundColor: '#fef9e7' }}>
            <th style={headerStyle}>Nama Karyawan</th>
            <th style={headerStyle}>Email</th>
            <th style={headerStyle}>Role</th>
            <th style={headerStyle}></th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={4} style={emptyStyle}>
                Memuat data karyawan...
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={4} style={{ ...emptyStyle, color: '#d32f2f' }}>
                ⚠️ {error}
              </td>
            </tr>
          ) : employees.length === 0 ? (
            <tr>
              <td colSpan={4} style={emptyStyle}>
                Belum ada data karyawan
              </td>
            </tr>
          ) : (
            employees.map((employee) => (
              <tr key={employee.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={cellStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: '#e3f2fd',
                      color: '#1565c0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '600',
                      fontSize: '14px'
                    }}>
                      {getInitial(employee.name)}
                    </div>
                    <span>{employee.name}</span>
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
                    display: 'inline-block',
                    textTransform: 'capitalize'
                  }}>
                    {employee.role || '-'}
                  </span>
                </td>
                <td style={cellStyle}>
                  <button style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '18px',
                    color: '#999',
                    padding: '4px 8px'
                  }}>
                    ⋮
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

const emptyStyle: React.CSSProperties = {
  padding: '40px 20px',
  textAlign: 'center',
  color: '#999',
  fontSize: '14px'
};