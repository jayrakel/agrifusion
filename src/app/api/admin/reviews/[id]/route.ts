import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
export async function PATCH(req: NextRequest, { params }: { params:{ id:string } }) {
  const session = await auth(); if (!session) return NextResponse.json({ error:'Unauthorized' }, { status:401 });
  return NextResponse.json(await prisma.review.update({ where:{ id:params.id }, data:await req.json() }));
}
export async function DELETE(_: NextRequest, { params }: { params:{ id:string } }) {
  const session = await auth(); if (!session) return NextResponse.json({ error:'Unauthorized' }, { status:401 });
  await prisma.review.delete({ where:{ id:params.id } });
  return NextResponse.json({ success:true });
}
