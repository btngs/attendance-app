"use client";

import { useEffect, useState, type ReactNode } from "react";


export const modalTheme = {
  primary: "#e8a838",
  primaryLight: "#fef3e2",
  danger: "#dc2626",
  dangerLight: "#fee2e2",
  textDark: "#333333",
  textMuted: "#6b7280",
  border: "#e5e0d8",
  cream: "#f5f0e8",
};

export type ConfirmVariant = "default" | "danger";

interface ConfirmModalProps {
  /** Mengontrol modal ditampilkan atau tidak */
  isOpen: boolean;
  /** Dipanggil saat user menutup modal (klik Batal / backdrop / Escape) */
  onClose: () => void;
  /** Dipanggil saat user menekan tombol konfirmasi (mis. Hapus) */
  onConfirm: () => void;
  /** Judul modal, mis. "Hapus Karyawan" */
  title: string;
  /** Ikon di bagian atas modal (mis. <Trash2 />) */
  icon?: ReactNode;
  /** Teks deskripsi singkat di bawah judul */
  description?: string;
  /** Konten bebas di tengah modal (mis. kartu info karyawan) */
  children?: ReactNode;
  /** Teks peringatan tambahan, ditampilkan dengan gaya warning */
  warningText?: string;
  /** Label button batal, default "Batal" */
  cancelLabel?: string;
  /** Label tombol konfirmasi, default "Konfirmasi" */
  confirmLabel?: string;
  /** Gaya visual tombol konfirmasi: 'default' (oranye) atau 'danger' (merah) */
  variant?: ConfirmVariant;
  /** Status loading, mis. saat proses hapus sedang berjalan ke server */
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  icon,
  description,
  children,
  warningText,
  cancelLabel = "Batal",
  confirmLabel = "Konfirmasi",
  variant = "default",
  isLoading = false,
}: ConfirmModalProps) {
  // Animasi masuk/keluar tetap berjalan sebelum modal di-unmount.
  const [isVisible, setIsVisible] = useState(false);
  const shouldRender = isOpen || isVisible;

  useEffect(() => {
    if (isOpen) {
      const raf = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(raf);
    }

    const timeout = window.setTimeout(() => setIsVisible(false), 200); // samakan dengan durasi transisi CSS
    return () => clearTimeout(timeout);
  }, [isOpen]);

  // Tutup modal dengan tombol Escape
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!shouldRender) return null;

  const confirmColor =
    variant === "danger" ? modalTheme.danger : modalTheme.primary;
  const confirmColorLight =
    variant === "danger" ? modalTheme.dangerLight : modalTheme.primaryLight;

  return (
    <div
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        backgroundColor: isVisible
          ? "rgba(20, 15, 10, 0.45)"
          : "rgba(20, 15, 10, 0)",
        backdropFilter: isVisible ? "blur(4px)" : "blur(0px)",
        WebkitBackdropFilter: isVisible ? "blur(4px)" : "blur(0px)",
        transition: "background-color 200ms ease, backdrop-filter 200ms ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "#ffffff",
          borderRadius: "20px",
          padding: "28px 24px 24px",
          boxShadow: "0 24px 60px rgba(0,0,0,0.2)",
          opacity: isVisible ? 1 : 0,
          transform: isVisible
            ? "scale(1) translateY(0)"
            : "scale(0.92) translateY(8px)",
          transition: "opacity 200ms ease, transform 200ms ease",
        }}
      >
        {/* Icon */}
        {icon && (
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              backgroundColor: confirmColorLight,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              color: confirmColor,
            }}
          >
            {icon}
          </div>
        )}

        {/* Title */}
        <h2
          id="confirm-modal-title"
          style={{
            fontSize: "18px",
            fontWeight: 700,
            color: modalTheme.textDark,
            textAlign: "center",
            margin: "0 0 8px",
          }}
        >
          {title}
        </h2>

        {/* Description */}
        {description && (
          <p
            style={{
              fontSize: "14px",
              color: modalTheme.textMuted,
              textAlign: "center",
              margin: "0 0 16px",
              lineHeight: 1.5,
            }}
          >
            {description}
          </p>
        )}

        {/* Custom content (mis. kartu info karyawan) */}
        {children && <div style={{ marginBottom: "16px" }}>{children}</div>}

        {/* Warning text */}
        {warningText && (
          <div
            style={{
              backgroundColor: modalTheme.dangerLight,
              color: modalTheme.danger,
              fontSize: "13px",
              fontWeight: 500,
              borderRadius: "10px",
              padding: "10px 14px",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            {warningText}
          </div>
        )}

        {/* Actions */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: warningText ? 0 : "8px",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "10px",
              border: `1px solid ${modalTheme.border}`,
              backgroundColor: "#f3f4f6",
              color: "#4b5563",
              fontSize: "14px",
              fontWeight: 600,
              cursor: isLoading ? "not-allowed" : "pointer",
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: confirmColor,
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: 600,
              cursor: isLoading ? "not-allowed" : "pointer",
              opacity: isLoading ? 0.75 : 1,
            }}
          >
            {isLoading ? "Memproses..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

