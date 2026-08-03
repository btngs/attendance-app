interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'hadir':
        return { backgroundColor: '#e8f5e9', color: '#2e7d32' };
      case 'tidak hadir':
        return { backgroundColor: '#fde8e8', color: '#c62828' };
      case 'terlambat':
        return { backgroundColor: '#fff9e6', color: '#f59e0b' };
      case 'izin':
        return { backgroundColor: '#e3f2fd', color: '#1565c0' };
      case 'wfh':
        return { backgroundColor: '#e3f2fd', color: '#1565c0' };
      case 'sakit':
        return { backgroundColor: '#e3f2fd', color: '#1565c0' };
      default:
        return { backgroundColor: '#f5f5f5', color: '#666' };
    }
  };

  return (
    <span style={{
      ...getStatusStyle(status),
      padding: '6px 16px',
      borderRadius: '20px',
      fontSize: '13px',
      fontWeight: '500',
      display: 'inline-block'
    }}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}