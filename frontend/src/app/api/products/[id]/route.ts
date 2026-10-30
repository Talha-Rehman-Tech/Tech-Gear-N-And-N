import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_PRODUCTS } from '@/data/products';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = DEFAULT_PRODUCTS.find(p => p._id === id);

  if (!product) {
    return NextResponse.json({ message: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json(product);
}
