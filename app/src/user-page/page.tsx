"use client";

import { useCallback, useState } from "react";
import { useQRScanner } from "../../QRScanner";
import API from "../services/api";

type ScanStatus = "idle" | "submitting" | "success" | "error";

export default function QRScanner() {
  const [status, setStatus] = useState<ScanStatus>("idle");
  const [message, setMessage] = useState("");

  const handleScan = useCallback(async (result: string) => {
    setStatus("submitting");
    setMessage("");

    try {
      // Assumes the backend exposes an endpoint that validates the
      // scanned barcode token and records attendance for the
      // currently authenticated user. Adjust the path/body below to
      // match your actual backend route if it differs.
      const response = await API.post("/attendance/scan", { token: result });

      setStatus("success");
      setMessage(response.data?.message ?? "Absensi berhasil dicatat.");
    } catch (error: unknown) {
      console.error("Gagal mengirim hasil scan:", error);

      let errorMessage = "Absensi gagal. Silakan scan ulang.";

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        errorMessage = axiosError.response?.data?.message ?? errorMessage;
      }

      setStatus("error");
      setMessage(errorMessage);
    }
  }, []);

  const { scanResult, resetScan } = useQRScanner("reader", handleScan);

  const handleReset = () => {
    setStatus("idle");
    setMessage("");
    resetScan();
  };

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <div className="flex flex-col items-center justify-center">
          {scanResult ? (
            <div
              className={`w-full max-w-xs rounded-2xl border p-5 text-center shadow-sm ${
                status === "error"
                  ? "border-red-200 bg-red-50"
                  : "border-emerald-200 bg-emerald-50"
              }`}
            >
              <p
                className={`text-xs font-bold uppercase tracking-wider ${
                  status === "error" ? "text-red-600" : "text-emerald-600"
                }`}
              >
                {status === "submitting" && "Memproses..."}
                {status === "success" && "Absen Berhasil"}
                {status === "error" && "Absen Gagal"}
              </p>

              <p className="mt-2 break-all text-sm font-semibold text-gray-800">
                {status === "submitting" ? scanResult : message || scanResult}
              </p>

              {status !== "submitting" && (
                <button
                  onClick={handleReset}
                  className="mt-4 w-full rounded-xl bg-amber-500 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
                >
                  Scan Lagi
                </button>
              )}
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
