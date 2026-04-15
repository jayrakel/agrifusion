import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
export async function GET(_: NextRequest, { params }: { params:{ id:string } }) {
  const session = await auth(); if (!session) return NextResponse.json({ error:'Unauthorized' }, { status:401 });
  const p = await prisma.product.findUnique({ where:{ id:params.id }, include:{ category:true } });
  return NextResponse.json(p);
}
export async function PATCH(req: NextRequest, { params }: { params:{ id:string } }) {
  const session = await auth(); if (!session) return NextResponse.json({ error:'Unauthorized' }, { status:401 });
  const body = await req.json();
  const p = await prisma.product.update({ where:{ id:params.id }, data:{ ...body, images:body.images||[], tags:body.tags||[] } });
  return NextResponse.json(p);
}
export async function DELETE(_: NextRequest, { params }: { params:{ id:string } }) {
  const session = await auth(); if (!session) return NextResponse.json({ error:'Unauthorized' }, { status:401 });
  await prisma.product.delete({ where:{ id:params.id } });
  return NextResponse.json({ success:true });
}
