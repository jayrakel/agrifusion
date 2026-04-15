import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
export async function GET(_: NextRequest, { params }: { params:{ id:string } }) {
  const session = await auth(); if (!session) return NextResponse.json({ error:'Unauthorized' }, { status:401 });
  const msg = await prisma.message.findUnique({ where:{ id:params.id } });
  if (msg?.status==='UNREAD') await prisma.message.update({ where:{ id:params.id }, data:{ status:'READ' } });
  return NextResponse.json(msg);
}
export async function PATCH(req: NextRequest, { params }: { params:{ id:string } }) {
  const session = await auth(); if (!session) return NextResponse.json({ error:'Unauthorized' }, { status:401 });
  return NextResponse.json(await prisma.message.update({ where:{ id:params.id }, data:await req.json() }));
}
export async function DELETE(_: NextRequest, { params }: { params:{ id:string } }) {
  const session = await auth(); if (!session) return NextResponse.json({ error:'Unauthorized' }, { status:401 });
  await prisma.message.delete({ where:{ id:params.id } });
  return NextResponse.json({ success:true });
}
