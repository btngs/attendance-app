'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import API from '../../services/api';

interface UserData {
  id: string;
  name: string;
  email: string;
  phone_number?: string;
  role?: string;
  avatar?: string;
}

export default function EditProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    role: '',
    password: ''
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load user data from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!token || !storedUser) {
      router.push('/src/auth/login');
      return;
    }

    try {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      
      // Pre-fill form dengan data user
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone_number: userData.phone_number || userData.phone || '',
        role: userData.role || '',
        password: '' // Password tidak di-pre-fill untuk keamanan
      });

      if (userData.avatar) {
        setPreviewImage(userData.avatar);
      }
    } catch (error) {
      console.error('Gagal parse user data:', error);
      router.push('/src/auth/login');
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      alert('User ID tidak ditemukan. Silakan login ulang.');
      router.push('/src/auth/login');
      return;
    }

    setLoading(true);

    try {
      // Siapkan data dasar yang wajib dikirim
      const updateData: any = {
        name: formData.name,
        email: formData.email,
        phone_number: formData.phone_number,
      };

      // Hanya kirim role jika diisi (opsional)
      if (formData.role.trim()) {
        updateData.role = formData.role.trim();
      }

      // Hanya kirim password jika diisi (opsional)
      if (formData.password.trim()) {
        updateData.password = formData.password;
      }

      console.log('Sending update request...', updateData);

      // Panggil API untuk update profile
      await API.put(`/users/update/${user.id}`, updateData);
      
      alert('Profile berhasil disimpan!');
      
      // Update localStorage dengan data baru
      const updatedUser = { 
        ...user, 
        name: formData.name,
        email: formData.email,
        phone_number: formData.phone_number,
        role: formData.role.trim() || user.role // Gunakan role baru jika ada, atau pertahankan yang lama
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      router.push('/src/admin-side/dashboard');
    } catch (error: any) {
      console.error('Gagal update profile:', error);
      
      // Handle error 403/401 (Token expired)
      if (error.response?.status === 403 || error.response?.status === 401) {
        alert('Sesi Anda telah berakhir. Silakan login ulang.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/src/auth/login');
        return;
      }
      
      const errorMessage = error.response?.data?.message || 'Gagal menyimpan profile. Silakan coba lagi.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (!user) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        <Sidebar />
        <main style={{ 
          marginLeft: '260px', 
          width: 'calc(100% - 260px)',
          padding: '40px 60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ color: '#e8a838' }}>Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Sidebar />
      
      <main style={{ 
        marginLeft: '260px', 
        width: 'calc(100% - 260px)',
        padding: '40px 60px'
      }}>
        {/* Header dengan Tombol Back */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px',
          marginBottom: '24px'
        }}>
          <button
            onClick={handleCancel}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '20px',
              color: '#333',
              padding: '0',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            ←
          </button>
          <h1 style={{ 
            color: '#e8a838', 
            fontSize: '24px', 
            fontWeight: '700',
            margin: 0
          }}>
            Edit profile
          </h1>
        </div>

        {/* Card Form */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '32px',
          border: '1px solid #e5e5e5',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '180px 1fr',
              gap: '32px',
              alignItems: 'start'
            }}>
              {/* Kolom Kiri - Avatar */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                {/* Avatar Circle */}
                <div style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  backgroundColor: previewImage ? 'transparent' : '#fef3e2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '8px',
                  overflow: 'hidden'
                }}>
                  {previewImage ? (
                    <img 
                      src={previewImage} 
                      alt="Profile"
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <span style={{
                      fontSize: '40px',
                      fontWeight: '700',
                      color: '#e8a838'
                    }}>
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                    </span>
                  )}
                </div>

                {/* Upload Button */}
                <label
                  htmlFor="photo-upload"
                  style={{
                    fontSize: '12px',
                    color: '#999',
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  ganti foto
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>

              {/* Kolom Kanan - Form Fields */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                {/* Nama Lengkap */}
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Nama Lengkap"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '6px',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#e8a838'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
                  />
                </div>

                {/* Email */}
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '6px',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#e8a838'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
                  />
                </div>

                {/* Nomor Telepon */}
                <div>
                  <input
                    type="tel"
                    name="phone_number"
                    placeholder="nomor telepon"
                    value={formData.phone_number}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '6px',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#e8a838'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
                  />
                </div>

                {/* Role (Opsional) */}
                <div>
                  <input
                    type="text"
                    name="role"
                    placeholder="role (opsional, misal: admin / karyawan)"
                    value={formData.role}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '6px',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#e8a838'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
                  />
                </div>

                {/* Password (Opsional) */}
                <div>
                  <input
                    type="password"
                    name="password"
                    placeholder="password (opsional, kosongkan jika tidak ingin mengubah)"
                    value={formData.password}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '6px',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#e8a838'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
                  />
                </div>

                {/* Tombol Aksi */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '12px',
                  marginTop: '8px'
                }}>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={loading}
                    style={{
                      padding: '8px 20px',
                      border: 'none',
                      borderRadius: '6px',
                      backgroundColor: 'transparent',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontSize: '13px',
                      color: '#666',
                      opacity: loading ? 0.5 : 1
                    }}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: '8px 20px',
                      border: 'none',
                      borderRadius: '6px',
                      backgroundColor: loading ? '#ccc' : '#e8a838',
                      color: '#ffffff',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontSize: '13px',
                      fontWeight: '600'
                    }}
                  >
                    {loading ? 'Menyimpan...' : 'Simpan'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}