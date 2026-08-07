'use client';

import { useRef, useState } from 'react';
import type { Employee } from './EmployeeTable';

// Warna tema utama, disamakan dengan komponen lain di aplikasi (Navbar, AddButton, Dashboard)
const PRIMARY = '#e8a838';
const PRIMARY_LIGHT = '#fef3e2';
const BORDER = '#e5e0d8';

interface AddEmployeeModalProps {
  onClose: () => void;
  onSave: (employee: Omit<Employee, 'id'>) => void;
  initialData?: Employee; // kalau ada, modal jalan dalam mode Edit
}

export default function AddEmployeeModal({ onClose, onSave, initialData }: AddEmployeeModalProps) {
  const isEditMode = Boolean(initialData);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [photoPreview, setPhotoPreview] = useState<string | null>(initialData?.photo ?? null);
  const [name, setName] = useState(initialData?.name ?? '');
  const [phone, setPhone] = useState(initialData?.phone ?? '');
  const [email, setEmail] = useState(initialData?.email ?? '');
  const [address, setAddress] = useState(initialData?.address ?? '');
  const [gender, setGender] = useState(initialData?.gender ?? '');
  const [division, setDivision] = useState(initialData?.division ?? '');
  const [position, setPosition] = useState(initialData?.position ?? '');
  const [education, setEducation] = useState(initialData?.education ?? '');
  const [emergencyContact, setEmergencyContact] = useState(initialData?.emergencyContact ?? '');
  const [role, setRole] = useState(initialData?.role ?? 'Tetap');

  function handlePhotoClick() {
    fileInputRef.current?.click();
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      alert('Nama Lengkap dan Email wajib diisi');
      return;
    }

    onSave({
      name: name.trim(),
      email: email.trim(),
      role,
      phone,
      address,
      gender,
      division,
      position,
      education,
      emergencyContact,
      photo: photoPreview ?? undefined,
    });
  }

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
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          padding: '28px 32px',
          width: '100%',
          maxWidth: '620px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
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
            {isEditMode ? 'Edit Anggota' : 'Tambah Anggota'}
          </h2>
        </div>

        {/* Foto + Nama Lengkap */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <div
              onClick={handlePhotoClick}
              style={{
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                backgroundColor: '#e0e0e0',
                backgroundImage: photoPreview ? `url(${photoPreview})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                cursor: 'pointer',
              }}
            />
            <span
              onClick={handlePhotoClick}
              style={{ fontSize: '12px', color: '#999', cursor: 'pointer', textAlign: 'center' }}
            >
              Pilih foto baru
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              style={{ display: 'none' }}
            />
          </div>

          <div style={{ flex: 1 }}>
            <input
              type="text"
              placeholder="Nama Lengkap"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ ...inputStyle, borderColor: PRIMARY }}
            />
          </div>
        </div>

        {/* Nomor Telepon */}
        <input
          type="tel"
          placeholder="Nomor Telepon"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{ ...inputStyle, marginBottom: '16px' }}
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ ...inputStyle, marginBottom: '16px' }}
        />

        {/* Grid 2 kolom */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
          <input
            type="text"
            placeholder="Alamat Lengkap"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={inputStyle}
          />
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            style={{ ...inputStyle, color: gender ? '#333' : '#999' }}
          >
            <option value="" disabled hidden>Jenis Kelamin</option>
            <option value="Laki-laki">Laki-laki</option>
            <option value="Perempuan">Perempuan</option>
          </select>

          <input
            type="text"
            placeholder="Divisi"
            value={division}
            onChange={(e) => setDivision(e.target.value)}
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Jabatan"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            style={inputStyle}
          />

          <input
            type="text"
            placeholder="Pendidikan terakhir"
            value={education}
            onChange={(e) => setEducation(e.target.value)}
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Kontak darurat"
            value={emergencyContact}
            onChange={(e) => setEmergencyContact(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Role (untuk konsistensi dengan tabel Karyawan) */}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{ ...inputStyle, marginBottom: '24px', maxWidth: '220px' }}
        >
          <option value="Tetap">Tetap</option>
          <option value="Kontrak">Kontrak</option>
          <option value="Magang">Magang</option>
        </select>

        {/* Tombol Simpan */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            style={{
              padding: '10px 32px',
              borderRadius: '8px',
              border: `1.5px solid ${PRIMARY}`,
              backgroundColor: PRIMARY_LIGHT,
              color: PRIMARY,
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: '10px',
  border: `1px solid ${BORDER}`,
  fontSize: '14px',
  color: '#333',
  outline: 'none',
  backgroundColor: '#fff',
  boxSizing: 'border-box',
};