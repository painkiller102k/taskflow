export default function Logo({ size = 32 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.31,
      background: '#6366f1', display: 'flex',
      alignItems: 'center', justifyContent: 'center', flexShrink: 0
    }}>
      <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 18 18" fill="none">
        <rect x="2" y="3" width="14" height="2.2" rx="1.1" fill="white"/>
        <rect x="2" y="7.9" width="9" height="2.2" rx="1.1" fill="white" opacity=".65"/>
        <rect x="2" y="12.8" width="11" height="2.2" rx="1.1" fill="white" opacity=".4"/>
        <circle cx="13.5" cy="13" r="3.2" fill="white" opacity=".95"/>
        <path d="M12.1 13l1 1 2.2-2.2" stroke="#6366f1"
          strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}