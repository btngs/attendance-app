'use client';

import { useEffect, useState } from 'react';

export type ToastVariant = 'success' | 'error' | 'info';

export interface ToastData {
  id: string;
  message: string;
  variant?: ToastVariant;
}

interface ToastProps extends ToastData {
  onDismiss: (id: string) => void;
  duration?: number;
}

const variantStyle: Record<ToastVariant, { bg: string; text: string; border: string }> = {
  success: { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
  error: { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' },
  info: { bg: '#fef3e2', text: '#e8a838', border: '#fde3b8' },
};

export function Toast({ id, message, variant = 'success', onDismiss, duration = 3000 }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showTimer = requestAnimationFrame(() => setIsVisible(true));
    const hideTimer = setTimeout(() => setIsVisible(false), duration);
    const removeTimer = setTimeout(() => onDismiss(id), duration + 200);

    return () => {
      cancelAnimationFrame(showTimer);
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, [id, duration, onDismiss]);

  const colors = variantStyle[variant];

  return (
    <div
      role="status"
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`,
        borderRadius: '12px',
        padding: '14px 18px',
        fontSize: '14px',
        fontWeight: 500,
        boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
        minWidth: '260px',
        maxWidth: '360px',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(-8px) scale(0.95)',
        transition: 'opacity 200ms ease, transform 200ms ease',
      }}
    >
      {message}
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
}

/**
 * Container untuk menumpuk beberapa toast di pojok kanan-atas layar.
 * Taruh <ToastContainer /> sekali di halaman/layout yang memakainya,
 * lalu kelola daftar toast lewat state (lihat contoh di karyawan/page.tsx).
 */
export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 2000,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}