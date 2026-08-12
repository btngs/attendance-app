interface ExportButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

export default function ExportButton({ onClick, disabled }: ExportButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '12px 20px',
        border: 'none',
        borderRadius: '8px',
        backgroundColor: 'transparent',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: '#1565c0',
        fontWeight: '500',
        whiteSpace: 'nowrap'
      }}
    >
      <span>Export</span>
    </button>
  );
}