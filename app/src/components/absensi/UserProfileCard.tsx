'use client';

interface UserProfileCardProps {
  name: string;
  role: string;
  initials: string;
  stats: Record<string, number>;
}

export default function UserProfileCard({
  name,
  role,
  initials,
  stats,
}: UserProfileCardProps) {
  return (
    <section
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        padding: '20px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
        marginBottom: '20px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: '#FFF4D9',
            color: '#F5A623',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
          }}
        >
          {initials}
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: '16px', color: '#1a1a1a' }}>{name}</h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#666' }}>{role}</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap' }}>
        {Object.entries(stats).map(([label, value]) => (
          <div key={label} style={{ flex: 1, minWidth: '90px', textAlign: 'center' }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#1a1a1a' }}>{value}</div>
            <div style={{ fontSize: '12px', color: '#666', textTransform: 'capitalize' }}>{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
