import { NextRequest, NextResponse } from 'next/server';

interface OrderItem {
  _id: string;
  orderItems: unknown[];
  shippingAddress: unknown;
  paymentInfo: unknown;
  itemsPrice: number;
  shippingPrice: number;
  totalPrice: number;
  orderStatus: string;
  createdAt: string;
}

const inMemoryOrders: OrderItem[] = [];

export async function GET() {
  return NextResponse.json(inMemoryOrders);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newOrder: OrderItem = {
      _id: 'ord_' + Date.now(),
      orderItems: body.orderItems || [],
      shippingAddress: body.shippingAddress || {},
      paymentInfo: body.paymentInfo || { method: 'COD', status: 'Pending' },
      itemsPrice: body.itemsPrice || 0,
      shippingPrice: body.shippingPrice || 0,
      totalPrice: body.totalPrice || 0,
      orderStatus: 'Processing',
      createdAt: new Date().toISOString()
    };
    inMemoryOrders.unshift(newOrder);

    return NextResponse.json(newOrder, { status: 201 });
  } catch {
    return NextResponse.json({ message: 'Failed to place order' }, { status: 500 });
  }
}
