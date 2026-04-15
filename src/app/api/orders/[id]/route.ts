import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const email = req.nextUrl.searchParams.get('email');
  const order = await prisma.order.findUnique({ where:{ orderNumber:params.id.toUpperCase() }, include:{ items:true } });
  if (!order) return NextResponse.json({ error:'Order not found' }, { status:404 });
  // If email provided, verify it matches (security)
  if (email && order.customerEmail.toLowerCase() !== email.toLowerCase()) {
    return NextResponse.json({ error:'Order not found' }, { status:404 });
  }
  // Return public-safe fields only
  return NextResponse.json({
    orderNumber: order.orderNumber,
    status:      order.status,
    paymentStatus: order.paymentStatus,
    total:       order.total,
    deliveryAddress: order.deliveryAddress,
    city:        order.city,
    createdAt:   order.createdAt,
    items:       order.items.map(i => ({ id:i.id, name:i.name, quantity:i.quantity, unit:i.unit, total:i.total })),
  });
}
