"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";

import {
  SORT_OPTIONS,
} from "../../constants/rekapitulasi";

import type {
  SortOption,
} from "../../types/rekapitulasi";

interface SortButtonProps {
  selectedSort: SortOption;
  onSortChange: (value: SortOption) => void;
}

export default function SortButton({
  selectedSort,
  onSortChange,
}: SortButtonProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(
          event.target as Node,
        )
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      style={{
        position: "relative",
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        style={{
          height: "36px",
          display: "inline-flex",
          alignItems: "center",
          gap: "7px",
          padding: "0 12px",
          border: "1px solid #dddddd",
          borderRadius: "6px",
          backgroundColor: "#ffffff",
          color: "#333333",
          fontSize: "11px",
          fontWeight: 500,
          cursor: "pointer",
        }}
      >
        <SlidersHorizontal
          size={13}
          strokeWidth={1.8}
        />

        <span>Sort</span>

        <ChevronDown
          size={12}
          style={{
            transform: open
              ? "rotate(180deg)"
              : "rotate(0)",
            transition: "transform 150ms ease",
          }}
        />
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            width: "175px",
            padding: "12px",
            backgroundColor: "#ffffff",
            border: "1px solid #eeeeee",
            borderRadius: "8px",
            boxShadow:
              "0 8px 24px rgba(0, 0, 0, 0.10)",
            zIndex: 100,
          }}
        >
          <div
            style={{
              marginBottom: "10px",
              color: "#777777",
              fontSize: "10px",
              fontWeight: 500,
            }}
          >
            Sort by
          </div>

          {SORT_OPTIONS.map((option) => {
            const checked =
              selectedSort === option.value;

            return (
              <label
                key={option.value}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "5px 0",
                  cursor: "pointer",
                  color: "#555555",
                  fontSize: "10px",
                }}
              >
                <input
                  type="radio"
                  name="attendance-sort"
                  value={option.value}
                  checked={checked}
                  onChange={() => {
                    onSortChange(option.value);
                    setOpen(false);
                  }}
                  style={{
                    width: "12px",
                    height: "12px",
                    accentColor: "#e8a838",
                    margin: 0,
                  }}
                />

                <span>{option.label}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}