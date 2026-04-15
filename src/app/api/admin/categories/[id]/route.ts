import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
export async function GET(_: NextRequest, { params }: { params:{ id:string } }) {
  const session = await auth(); if (!session) return NextResponse.json({ error:'Unauthorized' }, { status:401 });
  return NextResponse.json(await prisma.category.findUnique({ where:{ id:params.id } }));
}
export async function PATCH(req: NextRequest, { params }: { params:{ id:string } }) {
  const session = await auth(); if (!session) return NextResponse.json({ error:'Unauthorized' }, { status:401 });
  const body = await req.json();
  return NextResponse.json(await prisma.category.update({ where:{ id:params.id }, data:body }));
}
export async function DELETE(_: NextRequest, { params }: { params:{ id:string } }) {
  const session = await auth(); if (!session) return NextResponse.json({ error:'Unauthorized' }, { status:401 });
  await prisma.category.delete({ where:{ id:params.id } });
  return NextResponse.json({ success:true });
}
