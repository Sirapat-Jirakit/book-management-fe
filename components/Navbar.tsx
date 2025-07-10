'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: '/inventories', label: 'Inventories' },
    { href: '/books', label: 'Books' },
    { href: '/branches', label: 'Branches' },
  ];

  return (
    <nav className="bg-gray-600 text-white p-4 shadow-md">
      <div className="max-w-6xl mx-auto flex space-x-8">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`px-3 py-2 rounded-md hover:bg-white hover:text-black ${
              pathname === href ? 'bg-black font-semibold' : ''
            }`}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
