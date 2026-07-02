'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, BarChart2, Award, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const items = [
  { href: '/kursy', label: 'Kursy', icon: BookOpen },
  { href: '/panel', label: 'Postęp', icon: BarChart2 },
  { href: '/certyfikaty', label: 'Certyfikaty', icon: Award },
  { href: '/profil', label: 'Profil', icon: User },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-50"
      aria-label="Nawigacja mobilna"
    >
      <ul className="grid grid-cols-4 list-none" role="list">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  'flex flex-col items-center justify-center py-3 text-xs gap-1 touch-target transition-colors',
                  active ? 'text-brand-teal' : 'text-brand-muted hover:text-brand-teal'
                )}
                aria-current={active ? 'page' : undefined}
              >
                <Icon size={20} aria-hidden="true" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
