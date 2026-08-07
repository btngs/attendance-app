'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import logo from '../assets/logo-kemas.png';

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Data dummy admin (nanti diganti dari database)
  const adminData = {
    name: 'admin 1',
    avatar: null
  };

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { name: 'Dashboard', path: '/src/admin-side/dashboard' },
    { name: 'Barcode', path: '/src/admin-side/barcode' },
    { name: 'Rekapitulasi', path: '/src/admin-side/recap' },
    { name: 'Karyawan', path: '/src/admin-side/karyawan' },
  ];

  // Fungsi untuk cek apakah menu aktif
  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav style={{
      backgroundColor: '#ffffff',
      padding: '12px 60px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid #f0f0f0'
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Image 
          src={logo} 
          alt="Kemas Foundation"
          width={100}
          height={40}
          style={{ objectFit: 'contain' }}
          priority
        />
      </div>

      {/* Menu Navigasi */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {navItems.map((item) => {
          const active = isActive(item.path);
          
          return (
            <a
              key={item.name}
              href={item.path}
              style={{
                textDecoration: 'none',
                color: active ? '#e8a838' : '#555',
                fontSize: '14px',
                fontWeight: active ? '600' : '500',
                padding: '8px 16px',
                borderRadius: '8px',
                backgroundColor: active ? '#fef3e2' : 'transparent',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = '#fef3e2';
                  e.currentTarget.style.color = '#e8a838';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#555';
                }
              }}
            >
              {item.name}
            </a>
          );
        })}
      </div>

      {/* Avatar & Dropdown */}
      <div style={{ position: 'relative' }} ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '1px solid #ddd',
            backgroundColor: '#ffffff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            color: '#555'
          }}
        >
          {adminData.avatar ? (
            <img 
              src={adminData.avatar} 
              alt="Profile"
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />
          ) : (
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          )}
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '8px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            padding: '8px 0',
            minWidth: '200px',
            zIndex: 1000,
            border: '1px solid #eee'
          }}>
            {/* Header Admin */}
            <div style={{
              padding: '12px 16px',
              borderBottom: '1px solid #f0f0f0',
              marginBottom: '8px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#333'
              }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: '#e8a838',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  {adminData.avatar ? (
                    <img 
                      src={adminData.avatar} 
                      alt="Profile"
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    adminData.name.charAt(0).toUpperCase()
                  )}
                </div>
                {adminData.name}
              </div>
            </div>

            {/* Menu Items */}
            <button
              onClick={() => {
                router.push('/src/admin-side/edit-profile');
                setIsDropdownOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '10px 16px',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#333',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <span>✏️</span>
              Edit profile
            </button>

            <button
              onClick={() => {
                alert('Fitur Pengaturan Akun akan segera hadir!');
                setIsDropdownOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '10px 16px',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#333',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <span></span>
              Pengaturan akun
            </button>

            <div style={{ borderTop: '1px solid #f0f0f0', margin: '8px 0' }}></div>

            <button
              onClick={() => {
                alert('Fitur Keluar akan segera hadir!');
                setIsDropdownOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '10px 16px',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#f44336',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fde8e8'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <span></span>
              Keluar
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}