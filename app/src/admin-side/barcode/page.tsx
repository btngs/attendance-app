'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import {QRCodeCanvas } from 'qrcode.react'; // atau gunakan library lain

export default function BarcodePage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [countdown, setCountdown] = useState(360); // 6 menit dalam detik
  const [barcodeValue, setBarcodeValue] = useState('');

  // Update waktu setiap detik
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Countdown timer untuk refresh barcode
  useEffect(() => {
    const countdownTimer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Refresh barcode value saat countdown habis
          generateNewBarcode();
          return 360; // Reset ke 6 menit
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownTimer);
  }, []);

  // Generate barcode value baru
  const generateNewBarcode = () => {
    // Nanti ini akan diganti dengan API call untuk generate token baru
    const timestamp = new Date().getTime();
    const randomStr = Math.random().toString(36).substring(7);
    const newValue = `ATTENDANCE_${timestamp}_${randomStr}`;
    setBarcodeValue(newValue);
    console.log('New barcode generated:', newValue);
  };

  // Generate barcode pertama kali
  useEffect(() => {
    generateNewBarcode();
  }, []);

  // Format waktu
  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds} WIB`;
  };

  const formatDate = (date: Date) => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${dayName} ${day} ${month} ${year}`;
  };

  // Format countdown (MM:SS)
  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <main style={{ backgroundColor: '#f5f0e8', minHeight: '100vh' }}>
      <Navbar />
      
      <section style={{ 
        padding: '40px 60px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '60px',
          alignItems: 'start'
        }}>
          {/* Kolom Kiri - Judul dan Petunjuk */}
          <div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '600',
              color: '#333',
              marginBottom: '8px'
            }}>
              Absensi Kehadiran Karyawan
            </h1>
            
            <h2 style={{
              fontSize: '26px',
              fontWeight: '700',
              color: '#e8a838',
              marginBottom: '16px'
            }}>
              Kemas Foundation
            </h2>

            <p style={{
              fontSize: '14px',
              color: '#999',
              marginBottom: '32px'
            }}>
              {formatTime(currentTime)} | {formatDate(currentTime)}
            </p>

            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#333',
              marginBottom: '20px'
            }}>
              Petunjuk absensi
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <InstructionItem 
                number="1"
                text="Buka web (nama web nya) di ponsel kamu"
              />
              <InstructionItem 
                number="2"
                text="Pilih 'Scan Barcode' yang ada di halaman utama"
              />
              <InstructionItem 
                number="3"
                text="Scan barcode disini untuk melakukan absensi kehadiran"
              />
              <InstructionItem 
                number="4"
                text="Tunggu konfirmasi absensi berhasil pada layar ponsel anda"
              />
            </div>
          </div>

          {/* Kolom Kanan - QR Code */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              backgroundColor: '#ffffff',
              padding: '30px',
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              marginBottom: '16px'
            }}>
              {barcodeValue ? (
                <QRCodeCanvas 
                  value={barcodeValue}
                  size={320}
                  level="H"
                  includeMargin={true}
                  style={{ 
                    display: 'block',
                    maxWidth: '100%',
                    height: 'auto'
                  }}
                />
              ) : (
                <div style={{
                  width: '320px',
                  height: '320px',
                  backgroundColor: '#f5f5f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#999'
                }}>
                  Loading QR Code...
                </div>
              )}
            </div>

            <p style={{
              fontSize: '14px',
              color: '#999',
              textAlign: 'center'
            }}>
              Di perbarui dalam {formatCountdown(countdown)}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

// Komponen untuk setiap item petunjuk
interface InstructionItemProps {
  number: string;
  text: string;
}

function InstructionItem({ number, text }: InstructionItemProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '16px'
    }}>
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        backgroundColor: '#fef3e2',
        border: '1px solid #e8a838',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        <span style={{
          fontSize: '14px',
          fontWeight: '600',
          color: '#e8a838'
        }}>
          {number}
        </span>
      </div>
      
      <p style={{
        fontSize: '14px',
        color: '#555',
        lineHeight: '1.6',
        margin: 0,
        paddingTop: '6px'
      }}>
        {text}
      </p>
    </div>
  );
}