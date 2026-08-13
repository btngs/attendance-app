'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import API from '../services/api';
import logo from '../assets/logo-kemas.png';
import { 
  LayoutGrid, 
  Barcode, 
  FileText, 
  Users, 
  LogOut,
  Settings,
  UserPen
} from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Ambil data user dari localStorage (yang sudah disimpan LoginForm)
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Gagal parsing data user:', error);
        router.push('/src/auth/login');
      }
    } else {
      // 2. Jika tidak ada data user, redirect ke login
      router.push('/src/auth/login');
    }
  }, [router]);

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

  const handleLogout = async () => {
    try {
      await API.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Hapus data dari localStorage saat logout
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/src/auth/login');
    }
  };

  const menuItems = [
    { name: 'Dashboard', path: '/src/admin-side/dashboard', icon: LayoutGrid },
    { name: 'Barcode', path: '/src/admin-side/barcode', icon: Barcode },
    { name: 'Rekapitulasi', path: '/src/admin-side/recap', icon: FileText },
    { name: 'Karyawan', path: '/src/admin-side/karyawan', icon: Users },
  ];

  const isActive = (path: string) => pathname === path;

  // Tampilkan loading sederhana sambil cek localStorage
  if (!user) {
    return (
      <aside style={{
        width: '260px',
        backgroundColor: '#FDF6E3',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ color: '#e8a838' }}>Loading...</div>
      </aside>
    );
  }

  return (
    <aside style={{
      width: '260px',
      backgroundColor: '#FDF6E3',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 16px',
      position: 'fixed',
      left: 0,
      top: 0,
      boxShadow: '2px 0 8px rgba(0,0,0,0.05)'
    }}>
      {/* Logo */}
      <div style={{ 
        marginBottom: '32px',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <Image 
          src={logo} 
          alt="Kemas Foundation"
          width={120}
          height={50}
          style={{ objectFit: 'contain' }}
          priority
        />
      </div>

      {/* Profile Section - Clickable dengan Dropdown */}
      <div style={{ marginBottom: '32px', position: 'relative' }} ref={dropdownRef}>
        {/* Profile Card - Klik untuk buka dropdown */}
        <div 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            transition: 'box-shadow 0.2s',
            border: isDropdownOpen ? '2px solid #e8a838' : '2px solid transparent'
          }}
          onMouseEnter={(e) => {
            if (!isDropdownOpen) {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isDropdownOpen) {
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
            }
          }}
        >
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: '#e8a838',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '20px',
            fontWeight: '600',
            flexShrink: 0
          }}>
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt="Profile"
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
            ) : (
              (user?.name ? user.name.charAt(0).toUpperCase() : 'A')
            )}
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#333',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {user?.name || 'Admin'}
            </div>
            <div style={{
              fontSize: '12px',
              color: '#999',
              textTransform: 'capitalize'
            }}>
              {user?.role || 'Admin'}
            </div>
          </div>
        </div>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '8px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            padding: '8px 0',
            zIndex: 1000,
            border: '1px solid #f0f0f0'
          }}>
            {/* Edit Profile */}
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
                textAlign: 'left',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef3e2'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <UserPen size={18} color="#e8a838" />
              <span>Edit profile</span>
            </button>

            {/* Divider */}
            <div style={{ borderTop: '1px solid #f0f0f0', margin: '8px 0' }}></div>

            {/* Logout */}
            <button
              onClick={handleLogout}
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
                textAlign: 'left',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fde8e8'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <LogOut size={18} />
              <span>Keluar</span>
            </button>
          </div>
        )}
      </div>

      {/* Menu Navigation */}
      <nav style={{ flex: 1 }}>
        {menuItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;
          
          return (
            <a
              key={item.name}
              href={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                marginBottom: '8px',
                borderRadius: '8px',
                textDecoration: 'none',
                backgroundColor: active ? '#e8a838' : 'transparent',
                color: active ? '#fff' : '#555',
                fontWeight: active ? '600' : '500',
                transition: 'all 0.2s',
                cursor: 'pointer'
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
              <Icon size={20} />
              <span style={{ fontSize: '14px' }}>{item.name}</span>
            </a>
          );
        })}
      </nav>
    </aside>
  );
}