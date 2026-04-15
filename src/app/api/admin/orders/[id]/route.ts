import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
export async function GET(_: NextRequest, { params }: { params:{ id:string } }) {
  const session = await auth(); if (!session) return NextResponse.json({ error:'Unauthorized' }, { status:401 });
  return NextResponse.json(await prisma.order.findUnique({ where:{ id:params.id }, include:{ items:true } }));
}
export async function PATCH(req: NextRequest, { params }: { params:{ id:string } }) {
  const session = await auth(); if (!session) return NextResponse.json({ error:'Unauthorized' }, { status:401 });
  const body = await req.json();
  return NextResponse.json(await prisma.order.update({ where:{ id:params.id }, data:body, include:{ items:true } }));
}
