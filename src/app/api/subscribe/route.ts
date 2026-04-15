// src/app/api/subscribe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendSubscriptionConfirm } from '@/lib/email';
export async function POST(req: NextRequest) {
  const { email, name } = await req.json();
  if (!email?.includes('@')) return NextResponse.json({ error:'Invalid email' }, { status:400 });
  const existing = await prisma.subscriber.findUnique({ where:{ email } });
  if (existing?.status === 'ACTIVE') return NextResponse.json({ message:'Already subscribed!' });
  if (existing) {
    await prisma.subscriber.update({ where:{ email }, data:{ status:'PENDING' } });
  } else {
    await prisma.subscriber.create({ data:{ email, name, status:'PENDING' } });
  }
  const sub = await prisma.subscriber.findUnique({ where:{ email } });
  await sendSubscriptionConfirm({ email, name, token:sub!.token });
  return NextResponse.json({ success:true, message:'Check your email to confirm!' });
}
