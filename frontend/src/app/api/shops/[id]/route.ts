import { NextResponse } from 'next/server';
import shopsDataRaw from '@/data/shops.json';
import { Shop } from '@/types/shop';

const shops: Shop[] = shopsDataRaw as Shop[];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const shop = shops.find(s => s.id === id);

    if (!shop) {
      return NextResponse.json(
        { success: false, message: 'Shop not found' },
        { status: 404 }
      );
    }

    // Also get 4 nearby/related shops in the same area
    const nearby = shops
      .filter(s => s.area === shop.area && s.id !== shop.id)
      .slice(0, 4);

    return NextResponse.json({
      success: true,
      shop,
      nearby,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error retrieving shop';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

