'use client';

import { Trash2 } from 'lucide-react';
import ConfirmModal, { modalTheme } from '../ui/ConfirmModal';
import type { Employee } from './EmployeeTable';

interface DeleteEmployeeModalProps {
  employee: Employee | null;
  isOpen: boolean;
  isDeleting?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteEmployeeModal({
  employee,
  isOpen,
  isDeleting = false,
  onClose,
  onConfirm,
}: DeleteEmployeeModalProps) {
  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Hapus Karyawan"
      icon={<Trash2 size={26} strokeWidth={2} />}
      description="Apakah Anda yakin ingin menghapus data karyawan berikut?"
      warningText="Data yang telah dihapus tidak dapat dikembalikan."
      cancelLabel="Batal"
      confirmLabel="Hapus"
      variant="danger"
      isLoading={isDeleting}
    >
      {employee && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: modalTheme.cream,
            borderRadius: '12px',
            padding: '12px 14px',
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: '#e0e0e0',
              backgroundImage: employee.photo ? `url(${employee.photo})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              flexShrink: 0,
            }}
          />

          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: modalTheme.textDark,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {employee.name}
            </div>
            <div
              style={{
                fontSize: '13px',
                color: modalTheme.textMuted,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {employee.email}
            </div>
            <span
              style={{
                display: 'inline-block',
                marginTop: '4px',
                fontSize: '12px',
                fontWeight: 500,
                color: modalTheme.primary,
                backgroundColor: modalTheme.primaryLight,
                borderRadius: '999px',
                padding: '2px 10px',
              }}
            >
              {employee.role}
            </span>
          </div>
        </div>
      )}
    </ConfirmModal>
  );
}