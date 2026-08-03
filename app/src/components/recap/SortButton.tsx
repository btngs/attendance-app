import { useState,  useRef, useEffect } from "react";

interface SortButtonProps {
  selectedSort: string;
  onSortChange: (sort: string) => void;
}

const sortOptions = [
    { value: 'terbaru', label: 'Terbaru' },
    { value: '7hari', label: '7 Hari Terakhir' },
    {value: '1bulan', label: '1 Bulan Terakhir'},
    {value: '3bulan', label: '3 Bulan Terakhir'}
];

export default function SortButton({ selectedSort, onSortChange }: SortButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getCurrentLabel = () => {
        const option = sortOptions.find(opt => opt.value === selectedSort);
        return option ? option.label : 'Sort';
    };

    return (
        <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '12px 20px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: 'white',
          cursor: 'pointer',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          whiteSpace: 'nowrap'
        }}
      >
        <span>Sort</span>
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: '8px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          padding: '20px',
          minWidth: '220px',
          zIndex: 1000
        }}>
          <h3 style={{
            margin: '0 0 16px 0',
            fontSize: '16px',
            fontWeight: '600',
            color: '#333'
          }}>
            Sort by
          </h3>
          {sortOptions.map((option) => (
            <label
              key={option.value}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 0',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#555'
              }}
            >
              <input
                type="radio"
                name="sort"
                value={option.value}
                checked={selectedSort === option.value}
                onChange={(e) => {
                  onSortChange(e.target.value);
                  setIsOpen(false);
                }}
                style={{
                  width: '18px',
                  height: '18px',
                  accentColor: '#e8a838',
                  cursor: 'pointer'
                }}
              />
              {option.label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

