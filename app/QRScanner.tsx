"use client";

import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export function useQRScanner(elementId: string = "reader") {
  const [scanResult, setScanResult] = useState<string>("");

  useEffect(() => {
    if (!scanResult) {
      const scanner = new Html5QrcodeScanner(
        elementId,
        {
          qrbox: { width: 220, height: 220 },
          fps: 10,
          videoConstraints: { facingMode: "environment" },
        },
        /* verbose= */ false
      );

      scanner.render(
        (result) => {
          scanner.clear().catch((err) => console.error(err));
          setScanResult(result);
        },
        () => {} // silent error per frame
      );

      return () => {
        scanner.clear().catch((err) => console.error(err));
      };
    }
  }, [scanResult, elementId]);

  const resetScan = () => setScanResult("");

  return {
    scanResult,
    resetScan,
  };
}