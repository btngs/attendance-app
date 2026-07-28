"use client";

import { useQRScanner } from "../QRScanner";

export default function QRScanner() {
  const { scanResult, resetScan } = useQRScanner("reader"); 

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <div className="flex flex-col items-center justify-center">
          {scanResult ? (
            <div className="w-full max-w-xs rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Absen Berhasil
              </p>
              <p className="mt-2 break-all text-sm font-semibold text-gray-800">
                {scanResult}
              </p>
              <button
                onClick={resetScan}
                className="mt-4 w-full rounded-xl bg-amber-500 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
              >
                Scan Lagi
              </button>
            </div>
          ) : (
            <div className="w-full max-w-xs overflow-hidden rounded-2xl border-2 border-amber-500 bg-black shadow-md">
              <div id="reader" className="w-full" />
            </div>
          )}

          <style jsx global>{`
            #reader {
              border: none !important;
            }
            #reader video {
              object-fit: cover !important;
              border-radius: 0.8rem !important;
            }
            #reader__dashboard,
            #reader__status_span {
              display: none !important;
            }
          `}</style>
        </div>
      </section>
    </main>
  );
}
