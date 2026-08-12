'use client';

import { useEffect, useState } from 'react';

interface ClockSectionProps {
  isCheckIn: boolean;
  onToggleAbsen: () => void;
  isLoading: boolean;
}

export default function ClockSectionA({ isCheckIn, onToggleAbsen, isLoading }: ClockSectionProps) {
  const [time, setTime] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setTime(`${hours}:${minutes} WIB`);

      setDateStr(
        now.toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      );
    };

    updateClock();
    const interval = window.setInterval(updateClock, 1000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        textAlign: 'center',
        marginBottom: '24px',
      }}
    >
      <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>
        {dateStr || 'Senin, 3 Agustus 2026'}
      </p>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          margin: '8px 0 16px',
        }}
      >
        <h1
          style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: '#1a1a1a',
            margin: 0,
          }}
        >
          {time || '08:50 WIB'}
        </h1>
      </div>

      <button
        onClick={onToggleAbsen}
        disabled={isLoading}
        style={{
          width: '100%',
          backgroundColor: '#F5A623',
          color: '#ffffff',
          border: 'none',
          padding: '14px',
          borderRadius: '12px',
          fontSize: '15px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(245, 166, 35, 0.3)',
          opacity: isLoading ? 0.7 : 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
      >
        <span></span> {isLoading ? 'Memproses . . .' : isCheckIn ? 'MASUK' : 'KELUAR'}
      </button>
    </div>
  );
}

