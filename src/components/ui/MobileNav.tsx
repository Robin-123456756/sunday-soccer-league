'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navStyle, secondaryButtonStyle } from '@/components/ui/styles';
import type { ReactNode } from 'react';

interface NavLink {
  href: string;
  label: string;
}

export function MobileNav({
  links,
  userSlot,
}: {
  links: NavLink[];
  userSlot: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="nav-bar" style={{ ...navStyle, justifyContent: 'space-between', alignItems: 'center' }}>
      <div className="nav-top">
        <Link
          href="/"
          style={{ fontWeight: 700, fontSize: 16, textDecoration: 'none', color: '#111827' }}
          onClick={() => setOpen(false)}
        >
          SSL
        </Link>
        <button
          className="nav-toggle"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          {open ? '\u2715' : '\u2630'}
        </button>
      </div>

      <div className={`nav-links${open ? ' open' : ''}`}>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            style={{
              ...secondaryButtonStyle,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              background: pathname.startsWith(link.href) ? '#f3f4f6' : '#fff',
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className={`nav-user${open ? ' open' : ''}`}>
        {userSlot}
      </div>
    </nav>
  );
}
