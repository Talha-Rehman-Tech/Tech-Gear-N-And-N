import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import shopsDataRaw from '@/data/shops.json';
import { Shop } from '@/types/shop';

const shops: Shop[] = shopsDataRaw as Shop[];

// Haversine formula to calculate distance between coordinates in km
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || searchParams.get('q') || '';
    const area = searchParams.get('area') || '';
    const category = searchParams.get('category') || '';
    const group = searchParams.get('group') || '';
    const hasWhatsApp = searchParams.get('hasWhatsApp') === 'true';
    const verifiedOnly = searchParams.get('verified') === 'true';
    const userLat = parseFloat(searchParams.get('lat') || '');
    const userLng = parseFloat(searchParams.get('lng') || '');
    const limit = parseInt(searchParams.get('limit') || '0', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);

    let filtered = shops.map(shop => {
      if (!isNaN(userLat) && !isNaN(userLng) && shop.latitude && shop.longitude) {
        return {
          ...shop,
          distanceKm: calculateDistance(userLat, userLng, shop.latitude, shop.longitude)
        };
      }
      return shop;
    });

    // Filter by area
    if (area && area.toLowerCase() !== 'all') {
      filtered = filtered.filter(
        s => s.area.toLowerCase() === area.toLowerCase()
      );
    }

    // Filter by category or group
    if (group && group !== 'all') {
      filtered = filtered.filter(s => s.categoryGroup === group);
    } else if (category && category.toLowerCase() !== 'all') {
      filtered = filtered.filter(
        s => s.category.toLowerCase().includes(category.toLowerCase()) ||
             s.categoryGroup.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by WhatsApp
    if (hasWhatsApp) {
      filtered = filtered.filter(s => Boolean(s.whatsapp));
    }

    // Filter by verified
    if (verifiedOnly) {
      filtered = filtered.filter(s => s.verified);
    }

    // Filter by search query
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(
        s =>
          s.name.toLowerCase().includes(q) ||
          s.area.toLowerCase().includes(q) ||
          s.address.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.phone.includes(q)
      );
    }

    // Sort by distance if user coords provided
    if (!isNaN(userLat) && !isNaN(userLng)) {
      filtered.sort((a, b) => (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999));
    }

    // Areas and categories summary
    const allAreas = Array.from(new Set(shops.map(s => s.area))).sort();
    const areaCounts = allAreas.reduce((acc, a) => {
      acc[a] = shops.filter(s => s.area === a).length;
      return acc;
    }, {} as Record<string, number>);

    const total = filtered.length;

    // Optional pagination
    let paginatedShops = filtered;
    if (limit > 0) {
      const startIndex = (page - 1) * limit;
      paginatedShops = filtered.slice(startIndex, startIndex + limit);
    }

    return NextResponse.json({
      success: true,
      total,
      page,
      limit: limit || total,
      shops: paginatedShops,
      areas: allAreas,
      areaCounts,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch shops';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

