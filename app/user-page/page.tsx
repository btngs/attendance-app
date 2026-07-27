"use client"

import React, { useState } from "react";
import QRScanner from "../QRScanner";

export default function AbsenMobilePage() {
    const [scanResult, setScanResult] = useState<string | null>(null)
    const [cameraStatus, setCameraStatus] = useState<string>("")
    const handleScanSuccess = (data: string) => {
        setScanResult(data);
        console.log("Sukses Absensi");
    }
    return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-md text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Scan Absen Kedatangan
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Arahkan kamera ke QR Code yang ada di layar dashboard
        </p>

        <QRScanner
          onScanResults={handleScanSuccess}
          onStatusChange={setCameraStatus}
        />

        {cameraStatus && (
          <p className="mt-4 text-xs text-amber-700">
            {cameraStatus}
          </p>
        )}

        {scanResult && (
          <div className="mt-6 rounded-xl bg-green-50 p-4 border border-green-200">
            <p className="text-xs font-semibold text-green-600 uppercase tracking-wider">
              QR Code Terdeteksi:
            </p>
            <p className="mt-1 text-sm font-bold text-green-800 break-all">
              {scanResult}
            </p>
          </div>
        )}
      </div>
    </main>
    )
}
