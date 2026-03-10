import Link from 'next/link';
import { mutedTextStyle } from '@/components/ui/styles';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav style={{ fontSize: 14, marginBottom: 4 }}>
      {items.map((item, i) => (
        <span key={i}>
          {i > 0 ? <span style={{ ...mutedTextStyle, margin: '0 6px' }}>/</span> : null}
          {item.href ? (
            <Link href={item.href} style={{ color: '#4b5563', textDecoration: 'none' }}>
              {item.label}
            </Link>
          ) : (
            <span style={{ color: '#111827', fontWeight: 600 }}>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
