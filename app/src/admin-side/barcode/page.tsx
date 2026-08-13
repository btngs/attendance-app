'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { QRCodeCanvas } from 'qrcode.react';
import API from '../../services/api';

interface QRCodeData {
  id: string;
  token: string;
  expiresAt: string;
  isActive: boolean;
}

export default function BarcodePage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [countdown, setCountdown] = useState(360);
  const [qrCodeData, setQrCodeData] = useState<QRCodeData | null>(null);
  const [barcodeValue, setBarcodeValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate QR code baru dari backend
  const generateNewQRCode = async () => {
    try {
      setLoading(true);
      console.log('Generating new QR code...');
      
      // Panggil endpoint untuk generate QR code baru
      const response = await API.post('/qr-code/create');
      
      console.log('QR Code response:', response.data);
      
      // Simpan data QR code
      const qrData: QRCodeData = response.data;
      setQrCodeData(qrData);
      
      // Token untuk QR code
      setBarcodeValue(qrData.token);
      
      // Set countdown berdasarkan waktu expired dari backend
      const expiresAt = new Date(qrData.expiresAt);
      const now = new Date();
      const secondsUntilExpiry = Math.floor((expiresAt.getTime() - now.getTime()) / 1000);
      setCountdown(secondsUntilExpiry > 0 ? secondsUntilExpiry : 360);
      
    } catch (error) {
      console.error('Error generating QR code:', error);
      
      // Fallback jika API error
      const fallbackToken = generateFallbackToken();
      setBarcodeValue(fallbackToken);
      setCountdown(360);
    } finally {
      setLoading(false);
    }
  };

  // Ambil QR code aktif yang sudah ada
  const fetchActiveQRCode = async () => {
    try {
      console.log('Fetching active QR code...');
      const response = await API.get('/qr-code/active');
      
      console.log('Active QR code:', response.data);
      
      if (response.data) {
        const qrData: QRCodeData = response.data;
        setQrCodeData(qrData);
        setBarcodeValue(qrData.token);
        
        // Hitung sisa waktu
        const expiresAt = new Date(qrData.expiresAt);
        const now = new Date();
        const secondsUntilExpiry = Math.floor((expiresAt.getTime() - now.getTime()) / 1000);
        
        if (secondsUntilExpiry > 0) {
          setCountdown(secondsUntilExpiry);
          setLoading(false);
          return true; // QR code masih valid
        }
      }
      
      return false; // QR code tidak ada atau sudah expired
    } catch (error) {
      console.error('Error fetching active QR code:', error);
      return false;
    }
  };

  // Fallback token generator
  const generateFallbackToken = () => {
    const timestamp = new Date().getTime();
    const randomStr = Math.random().toString(36).substring(7);
    return `ATTENDANCE-${timestamp}-${randomStr}`;
  };

  // Countdown timer untuk refresh QR code
  useEffect(() => {
    const countdownTimer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // QR code expired, generate yang baru
          generateNewQRCode();
          return 360;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownTimer);
  }, []);

  // Update waktu real-time
  useEffect(() => {
    if (!mounted) return;
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [mounted]);

  // Load QR code pertama kali
  useEffect(() => {
    const loadQRCode = async () => {
      // Coba ambil QR code aktif dulu
      const hasActiveQR = await fetchActiveQRCode();
      
      // Jika tidak ada QR code aktif, generate yang baru
      if (!hasActiveQR) {
        await generateNewQRCode();
      }
    };
    
    loadQRCode();
  }, []);

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds} WIB`;
  };
  
  const formatDate = (date: Date) => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${dayName}, ${day} ${month} ${year}`;
  };

  const formatCountdown = (seconds: number) => {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${secs}`;
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <Sidebar />
      
      <main style={{ 
        marginLeft: '260px', 
        width: 'calc(100% - 260px)',
        padding: '40px 60px'
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
            }} suppressHydrationWarning>
              {mounted ? `${formatTime(currentTime)} | ${formatDate(currentTime)}` : 'Memuat...'}
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
                text="Buka web Absensi kemas di ponsel kamu"
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
              {loading ? (
                <div style={{
                  width: '320px',
                  height: '320px',
                  backgroundColor: '#f5f5f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#999',
                  borderRadius: '8px'
                }}>
                  Generating...
                </div>
              ) : (
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
              )}
            </div>

            <p style={{
              fontSize: '14px',
              color: '#999',
              textAlign: 'center'
            }} suppressHydrationWarning>
              {mounted ? `Di perbarui dalam ${formatCountdown(countdown)}` : ''}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

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