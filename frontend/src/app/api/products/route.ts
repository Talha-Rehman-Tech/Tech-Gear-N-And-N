import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_PRODUCTS, ProductItem } from '@/data/products';

const inMemoryProducts: ProductItem[] = [...DEFAULT_PRODUCTS];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const isFeatured = searchParams.get('isFeatured');
  const category = searchParams.get('category');
  const search = searchParams.get('keyword') || searchParams.get('search');

  let filtered = [...inMemoryProducts];

  if (isFeatured === 'true') {
    filtered = filtered.filter(p => p.isFeatured);
  }

  if (category && category !== 'all') {
    filtered = filtered.filter(p => {
      const pCat = typeof p.category === 'object' ? p.category.slug : p.category;
      return pCat === category || pCat.includes(category) || category.includes(pCat);
    });
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.brand.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }

  return NextResponse.json(filtered);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newProduct: ProductItem = {
      _id: 'prod_' + Date.now(),
      name: body.name || 'New Product',
      price: Number(body.price) || 999,
      discountPrice: body.discountPrice ? Number(body.discountPrice) : undefined,
      description: body.description || '',
      category: body.category || 'fast-chargers',
      stock: Number(body.stock) || 10,
      images: body.images?.length ? body.images : [{ url: 'https://images.unsplash.com/photo-1615526675159-e248c3021d3f?q=80&w=600&auto=format&fit=crop', public_id: 'def' }],
      variants: body.variants || [{ color: 'Standard', stock: 10 }],
      brand: body.brand || 'TechGear',
      ratings: 5.0,
      numOfReviews: 1,
      isFeatured: Boolean(body.isFeatured),
      specifications: body.specifications || []
    };

    inMemoryProducts.unshift(newProduct);
    return NextResponse.json(newProduct, { status: 201 });
  } catch {
    return NextResponse.json({ message: 'Invalid product data' }, { status: 400 });
  }
}
