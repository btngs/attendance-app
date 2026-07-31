export default function ExportButton() {
  return (
    <button
      style={{
        padding: '12px 20px',
        border: 'none',
        borderRadius: '8px',
        backgroundColor: 'transparent',
        cursor: 'pointer',
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