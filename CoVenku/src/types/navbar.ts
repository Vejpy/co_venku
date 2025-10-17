// src/types/navbar.ts
export interface NavbarItem {
  id: number;
  label: string;
  href: string;
  icon?: React.ReactNode; // optional for icons later
}