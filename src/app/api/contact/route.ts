// src/app/api/contact/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendContactNotification } from '@/lib/email';
export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, phone, subject, message } = body;
  if (!name || !email || !message) return NextResponse.json({ error:'Name, email and message required' }, { status:400 });
  await prisma.message.create({ data:{ name, email, phone, subject, message } });
  await sendContactNotification({ name, email, phone, subject, message });
  return NextResponse.json({ success:true });
}
