'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';

export default function EditProfilePage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: ''
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Data yang disimpan:', formData);
    alert('Profile berhasil disimpan!');
    router.push('/src/admin-side/dashboard');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <main style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Navbar />
      
      <section style={{ 
        padding: '40px 60px',
        maxWidth: '1000px',
        margin: '0 auto'
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

        {/* Card Form - Lebih compact */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '32px',
          border: '1px solid #e5e5e5'
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
                {/* Avatar Circle - Lebih kecil */}
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
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <span style={{
                      fontSize: '40px',
                      fontWeight: '700',
                      color: '#e8a838'
                    }}>
                      NL
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
                    name="fullName"
                    placeholder="Nama Lengkap"
                    value={formData.fullName}
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

                {/* Username */}
                <div>
                  <input
                    type="text"
                    name="username"
                    placeholder="username"
                    value={formData.username}
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

                {/* Email */}
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="email"
                    value={formData.email}
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

                {/* Nomor Telepon */}
                <div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="nomor telepon"
                    value={formData.phone}
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
                    style={{
                      padding: '8px 20px',
                      border: 'none',
                      borderRadius: '6px',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      fontSize: '13px',
                      color: '#666'
                    }}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '8px 20px',
                      border: 'none',
                      borderRadius: '6px',
                      backgroundColor: '#e8a838',
                      color: '#ffffff',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '600'
                    }}
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}