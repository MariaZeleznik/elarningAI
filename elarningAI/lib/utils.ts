import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(grosze: number): string {
  return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(grosze / 100);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('pl-PL', { dateStyle: 'long' }).format(new Date(date));
}

/**
 * Polish noun declension for "lekcja":
 * 1 → lekcja, 2-4 → lekcje, 5+ → lekcji
 */
export function formatLekcje(count: number): string {
  if (count === 1) return `${count} lekcja`;
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) {
    return `${count} lekcje`;
  }
  return `${count} lekcji`;
}

/**
 * Polish noun declension for "moduł":
 * 1 → moduł, 2-4 → moduły, 5+ → modułów
 */
export function formatModuly(count: number): string {
  if (count === 1) return `${count} moduł`;
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) {
    return `${count} moduły`;
  }
  return `${count} modułów`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[ąą]/g, 'a')
    .replace(/[ćć]/g, 'c')
    .replace(/[ęę]/g, 'e')
    .replace(/[łł]/g, 'l')
    .replace(/[ńń]/g, 'n')
    .replace(/[óó]/g, 'o')
    .replace(/[śś]/g, 's')
    .replace(/[źź]/g, 'z')
    .replace(/[żż]/g, 'z')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
