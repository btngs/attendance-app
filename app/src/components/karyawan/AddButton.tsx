interface AddButtonProps {
  onClick?: () => void;
}

export default function AddButton({ onClick }: AddButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '12px 24px',
        borderRadius: '8px',
        backgroundColor: '#fef3e2',
        border: '1.5px solid #e8a838',
        color: '#e8a838',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        whiteSpace: 'nowrap'
      }}
    >
      <span style={{ fontSize: '18px' }}>+</span>
      <span>Tambah Anggota</span>
    </button>
  );
}