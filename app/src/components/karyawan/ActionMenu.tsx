"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface ActionMenuProps {
  onEdit: () => void;
  onDelete: () => void;
  /** Dipanggil setiap kali dropdown terbuka/tertutup, dipakai parent untuk menjaga baris tetap ter-highlight saat menu terbuka */
  onOpenChange?: (isOpen: boolean) => void;
}

export default function ActionMenu({
  onEdit,
  onDelete,
  onOpenChange,
}: ActionMenuProps) {
  const [isOpen, setIsOpenState] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<"edit" | "delete" | null>(
    null,
  );
  const menuRef = useRef<HTMLDivElement>(null);

  const setIsOpen = useCallback(
    (value: boolean) => {
      setIsOpenState(value);
      onOpenChange?.(value);
    },
    [onOpenChange],
  );

  // Tutup menu kalau klik di luar area menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsOpen]);

  return (
    <div style={{ position: "relative" }} ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Opsi karyawan"
        style={{
          background: isOpen ? "#FFF3D6" : "none",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "18px",
          lineHeight: 1,
          color: isOpen ? "#F5A623" : "#8a8a8a",
          padding: "6px 9px",
          transition: "background-color 150ms ease, color 150ms ease",
        }}
      >
        ⋮
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "100%",
            marginTop: "4px",
            backgroundColor: "#fff",
            borderRadius: "10px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            border: "1px solid #f0ece3",
            overflow: "hidden",
            zIndex: 20,
            minWidth: "130px",
          }}
        >
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onEdit();
            }}
            onMouseEnter={() => setHoveredItem("edit")}
            onMouseLeave={() => setHoveredItem(null)}
            style={{
              ...menuItemStyle,
              backgroundColor:
                hoveredItem === "edit" ? "#FFF3D6" : "transparent",
              color: hoveredItem === "edit" ? "#F5A623" : "#333",
            }}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onDelete();
            }}
            onMouseEnter={() => setHoveredItem("delete")}
            onMouseLeave={() => setHoveredItem(null)}
            style={{
              ...menuItemStyle,
              backgroundColor:
                hoveredItem === "delete" ? "#fef2f2" : "transparent",
              color: "#c62828",
            }}
          >
            Hapus
          </button>
        </div>
      )}
    </div>
  );
}

const menuItemStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  textAlign: "left",
  padding: "10px 16px",
  border: "none",
  background: "none",
  cursor: "pointer",
  fontSize: "14px",
  color: "#333",
};
