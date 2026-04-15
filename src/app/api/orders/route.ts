// src/app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendOrderConfirmation, sendNewOrderNotification } from '@/lib/email';

function generateOrderNumber(): string {
  const d = new Date();
  const date = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
  const rand = Math.floor(Math.random()*9000)+1000;
  return `AF-${date}-${rand}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerName, customerEmail, customerPhone, deliveryAddress, city, notes, paymentMethod, items, subtotal, deliveryFee, total } = body;

    if (!customerName || !customerEmail || !items?.length) {
      return NextResponse.json({ error:'Missing required fields' }, { status:400 });
    }

    // Verify stock for all items
    for (const item of items) {
      const product = await prisma.product.findUnique({ where:{ id:item.productId } });
      if (!product) return NextResponse.json({ error:`Product not found: ${item.name}` }, { status:400 });
      if (product.stock < item.quantity) return NextResponse.json({ error:`Insufficient stock for ${item.name}` }, { status:400 });
    }

    const orderNumber = generateOrderNumber();

    const order = await prisma.order.create({
      data: {
        orderNumber, customerName, customerEmail,
        customerPhone: customerPhone || '',
        deliveryAddress, city: city || 'Nairobi',
        notes: notes || '',
        paymentMethod: paymentMethod || 'mpesa',
        subtotal, deliveryFee, total,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId, name: item.name,
            price: item.price, unit: item.unit,
            quantity: item.quantity, total: item.total,
          })),
        },
      },
      include: { items: true },
    });

    // Decrement stock
    for (const item of items) {
      await prisma.product.update({ where:{ id:item.productId }, data:{ stock:{ decrement:item.quantity } } });
    }

    // Send emails (non-blocking)
    Promise.all([
      sendOrderConfirmation({ orderNumber, customerName, customerEmail, items: order.items, subtotal, deliveryFee, total, deliveryAddress: `${deliveryAddress}, ${city}` }),
      sendNewOrderNotification({ orderNumber, customerName, customerEmail, total }),
    ]).catch(console.error);

    return NextResponse.json({ success:true, orderNumber, id:order.id });
  } catch (e) {
    console.error('Order creation error:', e);
    return NextResponse.json({ error:'Failed to create order' }, { status:500 });
  }
}
