'use client';

import type { Employee } from './EmployeeTable';

const PRIMARY = '#e8a838';
const PRIMARY_LIGHT = '#fef3e2';
const BORDER = '#e5e0d8';
const TEXT_MUTED = '#6b7280';

interface EmployeeDetailModalProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

interface DetailRow {
  label: string;
  value?: string;
}

export default function EmployeeDetailModal({ employee, isOpen, onClose, onEdit }: EmployeeDetailModalProps) {
  if (!isOpen || !employee) return null;

  const rows: DetailRow[] = [
    { label: 'Email', value: employee.email },
    { label: 'Nomor Telepon', value: employee.phone },
    { label: 'Alamat Lengkap', value: employee.address },
    { label: 'Jenis Kelamin', value: employee.gender },
    { label: 'Divisi', value: employee.division },
    { label: 'Jabatan', value: employee.position },
    { label: 'Pendidikan Terakhir', value: employee.education },
    { label: 'Kontak Darurat', value: employee.emergencyContact },
  ];

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          padding: '28px 32px',
          width: '100%',
          maxWidth: '480px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
          <button
            type="button"
            onClick={onClose}
            aria-label="Kembali"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '22px',
              color: '#666',
              lineHeight: 1,
              padding: '4px',
            }}
          >
            &lt;
          </button>
          <h2 style={{ color: PRIMARY, fontSize: '22px', fontWeight: 700, margin: 0 }}>
            Detail Karyawan
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#e0e0e0',
              backgroundImage: employee.photo ? `url(${employee.photo})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              flexShrink: 0,
            }}
          />
          <div>
            <div style={{ fontSize: '17px', fontWeight: 700, color: '#333' }}>{employee.name}</div>
            <span
              style={{
                display: 'inline-block',
                marginTop: '6px',
                fontSize: '12px',
                fontWeight: 500,
                color: PRIMARY,
                backgroundColor: PRIMARY_LIGHT,
                borderRadius: '999px',
                padding: '3px 12px',
              }}
            >
              {employee.role || '-'}
            </span>
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${BORDER}` }}>
          {rows.map((row) => (
            <div
              key={row.label}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '16px',
                padding: '12px 0',
                borderBottom: `1px solid ${BORDER}`,
              }}
            >
              <span style={{ fontSize: '13px', color: TEXT_MUTED }}>{row.label}</span>
              <span
                style={{
                  fontSize: '13px',
                  color: '#333',
                  fontWeight: 500,
                  textAlign: 'right',
                }}
              >
                {row.value && row.value.trim() !== '' ? row.value : '-'}
              </span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '10px',
              border: `1px solid ${BORDER}`,
              backgroundColor: '#f3f4f6',
              color: '#4b5563',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={onEdit}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '10px',
              border: `1.5px solid ${PRIMARY}`,
              backgroundColor: PRIMARY_LIGHT,
              color: PRIMARY,
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}