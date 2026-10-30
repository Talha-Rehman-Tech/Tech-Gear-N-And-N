import { NextResponse } from 'next/server';

export const CATEGORIES = [
  { _id: 'cat_chargers', name: 'Fast Chargers', slug: 'fast-chargers' },
  { _id: 'cat_earbuds', name: 'Wireless Earbuds', slug: 'earbuds' },
  { _id: 'cat_headphones', name: 'Headphones', slug: 'headphones' },
  { _id: 'cat_keyboards', name: 'Keyboards', slug: 'keyboards' },
  { _id: 'cat_mice', name: 'Mice', slug: 'mice' },
  { _id: 'cat_wireless', name: 'Wireless Devices & Docks', slug: 'wireless-devices' },
  { _id: 'cat_usb', name: 'USB & Flash Drives', slug: 'usb-drives' },
  { _id: 'cat_powerbanks', name: 'Power Banks', slug: 'power-banks' },
  { _id: 'cat_cables', name: 'Durable Cables', slug: 'cables' }
];

export async function GET() {
  return NextResponse.json(CATEGORIES);
}
