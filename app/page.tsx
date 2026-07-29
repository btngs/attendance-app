"use client"

import React from 'react';
import Image from 'next/image';
import Logo from './src/assets/logo-kemas.png'

export default function RoleSelection() {
  const handleSelectRole = (role: string) => {
    console.log(`Role dipilih: ${role}`);
    // Tambahkan navigasi atau logika setelah role dipilih di sini
  };

  return (
    <div className="relative min-h-screen w-full bg-white flex flex-col items-center justify-center p-4 overflow-hidden select-none">
      
      {/* --- Background Decorative Circles --- */}
      <div className="absolute top-12 left-1/4 w-32 h-32 bg-[#FFF6E5] rounded-full opacity-80 pointer-events-none" />
      <div className="absolute top-24 right-[15%] w-40 h-40 bg-[#FFF6E5] rounded-full opacity-80 pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-[#FFF6E5] rounded-full opacity-80 pointer-events-none" />
      <div className="absolute bottom-12 right-[8%] w-36 h-36 bg-[#FFF6E5] rounded-full opacity-80 pointer-events-none" />

      {/* --- Main Content Container --- */}
      <div className="relative z-10 flex flex-col items-center max-w-md w-full text-center">
        
        {/* Logo Section */}
        <div className="mb-12 flex flex-col items-center">
          <div className="mx-auto flex flex-col items-center text-center">
            <div className="flex h-32 w-64 items-center justify-center">
                <Image
                src={Logo}
                alt="Kemas Foundation"
                width={256}
                height={256}
                priority
              />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-lg md:text-xl font-bold text-[#E58A1F] mb-8">
          Pilih role anda untuk lanjut ke halaman berikutnya
        </h1>

        {/* Role Buttons */}
        <div className="w-full space-y-4 px-4">
          {/* Button 1: Karyawan */}
          <button
            onClick={() => handleSelectRole('Karyawan')}
            className="w-full py-3.5 px-6 bg-[#FFF2D6] hover:bg-[#FFE8B8] text-[#D4801D] font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.99]"
          >
            Karyawan
          </button>

          {/* Button 2: Admin */}
          <button
            onClick={() => handleSelectRole('Admin')}
            className="w-full py-3.5 px-6 bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.99]"
          >
            Admin
          </button>
        </div>

      </div>
    </div>
  );
}