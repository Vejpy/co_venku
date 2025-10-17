// src/components/navbar/NavbarItem.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavbarItem as NavbarItemType } from '@/types/navbar';

interface Props {
  item: NavbarItemType;
}

export default function NavbarItem({ item }: Props) {
  const pathname = usePathname();
  const isActive = pathname === item.href;

  return (
    <Link
      href={item.href}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200
        ${isActive 
          ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600' 
          : 'text-black hover:text-blue-600 hover:bg-gray-100'
        }`}
    >
      {item.label}
    </Link>
  );
} 