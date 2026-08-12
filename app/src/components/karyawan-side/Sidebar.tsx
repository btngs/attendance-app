'use client';

import Link from 'next/link';
import Image from 'next/image';
import logo from '../../assets/logo-kemas.png';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: 40,
        }}
      />

      <aside
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: '260px',
          backgroundColor: '#ffffff',
          zIndex: 50,
          boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 20px',
        }}
      >
        <div
          style={{
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Image
            src={logo}
            alt="Logo"
            width={140}
            height={45}
            priority
            style={{ objectFit: 'contain' }}
          />
        </div>

        <nav
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
          }}
        >
          <Link
            href="/karyawan-side/absensi"
            onClick={onClose}
            style={{
              textDecoration: 'none',
              color: '#1a1a1a',
              fontWeight: 600,
              fontSize: '15px',
            }}
          >
            Beranda
          </Link>
          <Link
            href="/karyawan-side/riwayat-absensi"
            onClick={onClose}
            style={{
              textDecoration: 'none',
              color: '#555555',
              fontWeight: 500,
              fontSize: '15px',
            }}
          >
            Riwayat Absensi
          </Link>
          <Link
            href="#"
            onClick={onClose}
            style={{
              textDecoration: 'none',
              color: '#555555',
              fontWeight: 500,
              fontSize: '15px',
            }}
          >
            Profil
          </Link>
        </nav>
      </aside>
    </>
  );
}