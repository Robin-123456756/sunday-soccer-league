import type { CSSProperties } from 'react';

export const pageStyle: CSSProperties = {
  padding: 24,
  fontFamily: 'Arial, sans-serif',
  background: '#f7f7fb',
  minHeight: '100vh',
};

export const cardStyle: CSSProperties = {
  background: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: 12,
  padding: 20,
  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
};

export const gridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: 16,
};

export const inputStyle: CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 8,
  border: '1px solid #d1d5db',
  fontSize: 14,
  background: '#fff',
};

export const labelStyle: CSSProperties = {
  display: 'block',
  fontSize: 14,
  fontWeight: 600,
  marginBottom: 6,
};

export const buttonStyle: CSSProperties = {
  padding: '10px 16px',
  borderRadius: 8,
  border: 'none',
  background: '#111827',
  color: '#fff',
  fontWeight: 600,
  cursor: 'pointer',
};

export const secondaryButtonStyle: CSSProperties = {
  ...buttonStyle,
  background: '#fff',
  color: '#111827',
  border: '1px solid #d1d5db',
};

export const sectionTitleStyle: CSSProperties = {
  fontSize: 18,
  fontWeight: 700,
  margin: '0 0 16px',
};

export const shellStyle: CSSProperties = {
  minHeight: '100vh',
  background: '#f7f7fb',
  color: '#111827',
  fontFamily: 'Arial, sans-serif',
};

export const navStyle: CSSProperties = {
  display: 'flex',
  gap: 12,
  flexWrap: 'wrap',
  padding: '16px 24px',
  borderBottom: '1px solid #e5e7eb',
  background: '#ffffff',
  position: 'sticky',
  top: 0,
  zIndex: 20,
};

export const tableStyle: CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: 14,
};

export const thStyle: CSSProperties = {
  textAlign: 'left',
  padding: '12px 10px',
  borderBottom: '1px solid #e5e7eb',
  color: '#374151',
  fontWeight: 700,
  background: '#f9fafb',
};

export const tdStyle: CSSProperties = {
  padding: '12px 10px',
  borderBottom: '1px solid #e5e7eb',
  verticalAlign: 'top',
};

export const badgeBaseStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  borderRadius: 999,
  padding: '4px 10px',
  fontSize: 12,
  fontWeight: 700,
};

export const mutedTextStyle: CSSProperties = {
  color: '#4b5563',
  margin: 0,
};
