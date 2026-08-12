'use client';

interface FilterTabsProps {
  activeFilter: string;
  onSelectFilter: (filter: string) => void;
}

const filters = [
  { label: 'Semua', value: 'semua' },
  { label: 'Hadir', value: 'hadir' },
  { label: 'Sakit', value: 'sakit' },
  { label: 'Izin', value: 'izin' },
  { label: 'Tidak Hadir', value: 'tidak-hadir' },
];

export default function FilterTabs({ activeFilter, onSelectFilter }: FilterTabsProps) {
  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
      {filters.map((filter) => {
        const isActive = activeFilter === filter.value;
        return (
          <button
            key={filter.value}
            onClick={() => onSelectFilter(filter.value)}
            style={{
              border: '1px solid #F5A623',
              borderRadius: '999px',
              backgroundColor: isActive ? '#F5A623' : '#ffffff',
              color: isActive ? '#ffffff' : '#F5A623',
              padding: '8px 12px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
