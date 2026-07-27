"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

interface Props {
  onScanResults: (result: string) => void;
  onStatusChange?: (status: string) => void;
}

export default function QRScanner({ onScanResults, onStatusChange }: Props) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const onScanResultsRef = useRef(onScanResults);
  const [localStatus, setLocalStatus] = useState("Siap memulai kamera.");
  const [isStarting, setIsStarting] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    onScanResultsRef.current = onScanResults;
  }, [onScanResults]);

  const setStatus = useCallback(
    (message: string) => {
      setLocalStatus(message);
      onStatusChange?.(message);
    },
    [onStatusChange]
  );

  const pickFrontCameraId = useCallback(async () => {
    const cameras = await Html5Qrcode.getCameras();
    if (!cameras || cameras.length === 0) {
      return null;
    }

    const frontCamera = cameras.find((camera) => {
      const label = camera.label.toLowerCase();
      return (
        label.includes("front") ||
        label.includes("user") ||
        label.includes("selfie")
      );
    });

    return frontCamera?.id ?? cameras[0].id;
  }, []);

  const startScanner = useCallback(async () => {
    const html5QrCode = scannerRef.current;
    if (!html5QrCode || isStarting || html5QrCode.isScanning) {
      return;
    }

    setIsStarting(true);

    try {
      if (typeof window !== "undefined" && !window.isSecureContext) {
        setStatus("Kamera butuh HTTPS atau localhost.");
        return;
      }

      if (!navigator.mediaDevices?.getUserMedia) {
        setStatus("Browser ini tidak mendukung kamera.");
        return;
      }

      setStatus("Meminta izin kamera...");
      await html5QrCode.start(
        { facingMode: "user" },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (decodedText) => {
          setStatus("QR terbaca.");
          onScanResultsRef.current(decodedText);
          html5QrCode.stop().catch((error) => console.error(error));
        },
        () => {}
      );

      setStatus("Kamera depan aktif.");
      setIsReady(true);
      return;
    } catch (err) {
      console.warn("Kamera depan tidak responsif, mencoba fallback...", err);
    }

    try {
      const frontCameraId = await pickFrontCameraId();
      if (!frontCameraId) {
        setStatus("Tidak ada kamera yang ditemukan.");
        return;
      }

      setStatus("Mencoba kamera depan terdeteksi...");
      await html5QrCode.start(
        frontCameraId,
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (decodedText) => {
          setStatus("QR terbaca.");
          onScanResultsRef.current(decodedText);
          html5QrCode.stop().catch((error) => console.error(error));
        },
        () => {}
      );

      setStatus("Kamera depan aktif.");
      setIsReady(true);
    } catch (fallbackErr) {
      console.error("Gagal memuat kamera:", fallbackErr);
      setStatus("Gagal membuka kamera di mobile.");
    } finally {
      setIsStarting(false);
    }
  }, [isStarting, pickFrontCameraId, setStatus]);

  useEffect(() => {
    scannerRef.current = new Html5Qrcode("reader");

    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch((error) => console.error(error));
      }
    };
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col items-center justify-center p-2">
      <p className="mb-3 text-sm text-gray-500">{localStatus}</p>
      {!isReady && (
        <button
          type="button"
          onClick={() => void startScanner()}
          className="mb-4 rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isStarting}
        >
          {isStarting ? "Membuka kamera..." : "Aktifkan Kamera"}
        </button>
      )}
      <div
        id="reader"
        className="relative flex h-[320px] w-full max-w-[320px] items-center justify-center overflow-hidden rounded-2xl border-2 border-amber-500 bg-black"
      />

      <style jsx global>{`
        #reader video {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
        }
      `}</style>
    </div>
  );
}
