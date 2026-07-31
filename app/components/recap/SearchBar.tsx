interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div style={{
      position: 'relative',
      flex: 1,
      maxWidth: '400px'
    }}>
      <span style={{
        position: 'absolute',
        left: '16px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#999',
        fontSize: '16px'
      }}>
        
      </span>
      <input
        type="text"
        placeholder="Cari nama karyawan"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '12px 16px 12px 48px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          fontSize: '14px',
          outline: 'none'
        }}
      />
    </div>
  );
}