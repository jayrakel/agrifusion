import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
export async function GET(req: NextRequest) {
  const session = await auth(); if (!session) return NextResponse.json({ error:'Unauthorized' }, { status:401 });
  const status = req.nextUrl.searchParams.get('status');
  const orders = await prisma.order.findMany({ where:status?{ status:status as any }:{}, include:{ items:true }, orderBy:{ createdAt:'desc' } });
  return NextResponse.json(orders);
}
